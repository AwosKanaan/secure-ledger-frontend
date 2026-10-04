<script setup lang="ts">
import type { Transaction, TransactionSort } from '../../api/types'
import { formatAmount, formatDate, formatIban } from '../../utils/format'

type SortField = 'createdAt' | 'amount'
type SortDirection = 'ascending' | 'descending' | 'none'

const SORT_ARROWS: Record<SortDirection, string> = { ascending: '↑', descending: '↓', none: '' }

defineProps<{ transactions: readonly Transaction[]; loading: boolean }>()
const sort = defineModel<TransactionSort>('sort', { required: true })

function sortDirection(field: SortField): SortDirection {
  if (!sort.value.startsWith(`${field},`)) {
    return 'none'
  }
  return sort.value.endsWith(',asc') ? 'ascending' : 'descending'
}

function toggleSort(field: SortField) {
  sort.value = sort.value === `${field},desc` ? `${field},asc` : `${field},desc`
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
    <table class="min-w-full text-left text-sm" :class="{ 'opacity-60': loading }" :aria-busy="loading">
      <thead class="bg-slate-50 text-xs font-semibold tracking-wide text-slate-600 uppercase">
        <tr>
          <th scope="col" class="px-4 py-3 whitespace-nowrap" :aria-sort="sortDirection('createdAt')">
            <button type="button" class="uppercase hover:text-slate-900" @click="toggleSort('createdAt')">
              Date (UTC) {{ SORT_ARROWS[sortDirection('createdAt')] }}
            </button>
          </th>
          <th scope="col" class="px-4 py-3 text-right whitespace-nowrap" :aria-sort="sortDirection('amount')">
            <button type="button" class="uppercase hover:text-slate-900" @click="toggleSort('amount')">
              Amount {{ SORT_ARROWS[sortDirection('amount')] }}
            </button>
          </th>
          <th scope="col" class="px-4 py-3">Currency</th>
          <th scope="col" class="px-4 py-3">Description</th>
          <th scope="col" class="px-4 py-3 whitespace-nowrap">Counterparty IBAN</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        <tr v-for="transaction in transactions" :key="transaction.id">
          <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(transaction.createdAt) }}</td>
          <td class="px-4 py-3 text-right font-mono whitespace-nowrap tabular-nums">
            {{ formatAmount(transaction.amount, transaction.currency) }}
          </td>
          <td class="px-4 py-3">{{ transaction.currency }}</td>
          <td class="min-w-48 px-4 py-3">{{ transaction.description ?? '—' }}</td>
          <td class="px-4 py-3 font-mono whitespace-nowrap">{{ formatIban(transaction.counterpartyIban) }}</td>
        </tr>
        <tr v-if="transactions.length === 0">
          <td colspan="5" class="px-4 py-10 text-center text-slate-500">
            {{ loading ? 'Loading transactions…' : 'No transactions found.' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
