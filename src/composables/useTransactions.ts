import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listTransactions, TRANSACTIONS_KEY } from '../api/transactions'
import { TRANSACTION_SORTS, type TransactionQuery, type TransactionSort } from '../api/types'

const PAGE_SIZE = 10

type Filters = Omit<TransactionQuery, 'size'>

export function useTransactions() {
  const route = useRoute()
  const router = useRouter()
  const queryClient = useQueryClient()

  const filters = computed<Filters>(() => {
    const sort = route.query.sort as TransactionSort
    return {
      page: Math.max(1, Number(route.query.page) || 1),
      sort: TRANSACTION_SORTS.includes(sort) ? sort : 'createdAt,desc',
      startDate: String(route.query.startDate ?? ''),
      endDate: String(route.query.endDate ?? ''),
    }
  })

  // changing a filter starts again at page 1
  function update(changes: Partial<Filters>) {
    const next = { ...filters.value, page: 1, ...changes }
    return router.replace({
      query: {
        page: String(next.page),
        sort: next.sort,
        startDate: next.startDate || undefined,
        endDate: next.endDate || undefined,
      },
    })
  }

  const page = computed({
    get: () => filters.value.page,
    set: (value: number) => update({ page: value }),
  })

  const sort = computed({
    get: () => filters.value.sort,
    set: (value: TransactionSort) => update({ sort: value }),
  })

  const startDate = computed({
    get: () => filters.value.startDate,
    set: (value: string) => update({ startDate: value }),
  })

  const endDate = computed({
    get: () => filters.value.endDate,
    set: (value: string) => update({ endDate: value }),
  })

  const dateRangeError = computed(() => {
    const { startDate, endDate } = filters.value
    return startDate && endDate && startDate > endDate ? 'The start date must be on or before the end date.' : ''
  })

  const query = computed<TransactionQuery>(() => ({ ...filters.value, size: PAGE_SIZE }))

  const { data, isFetching } = useQuery({
    queryKey: computed(() => [...TRANSACTIONS_KEY, query.value] as const),
    queryFn: ({ signal }) => listTransactions(query.value, signal),
    enabled: computed(() => !dateRangeError.value),
    placeholderData: keepPreviousData,
  })

  function clearDates() {
    update({ startDate: '', endDate: '' })
  }

  async function reload() {
    await update({})
    // new transaction changes all pages, so clear them
    return queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
  }

  return {
    page,
    sort,
    startDate,
    endDate,
    result: data,
    loading: isFetching,
    dateRangeError,
    clearDates,
    reload,
  }
}
