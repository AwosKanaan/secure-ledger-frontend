<script setup lang="ts">
import { shallowRef } from 'vue'
import { toast } from 'vue-sonner'
import AppHeader from '../components/layout/AppHeader.vue'
import CreateTransactionDialog from '../components/transactions/CreateTransactionDialog.vue'
import TransactionCardList from '../components/transactions/TransactionCardList.vue'
import TransactionFilters from '../components/transactions/TransactionFilters.vue'
import TransactionPagination from '../components/transactions/TransactionPagination.vue'
import TransactionSortSelect from '../components/transactions/TransactionSortSelect.vue'
import TransactionTable from '../components/transactions/TransactionTable.vue'
import { useTransactions } from '../composables/useTransactions'

const { page, sort, startDate, endDate, result, loading, dateRangeError, clearDates, reload } = useTransactions()

const createOpen = shallowRef(false)

function handleCreated() {
  toast.success('Transaction recorded.')
  reload()
}
</script>

<template>
  <AppHeader />
  <main class="mx-auto max-w-6xl space-y-4 px-4 py-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <TransactionFilters
        v-model:start-date="startDate"
        v-model:end-date="endDate"
        :error="dateRangeError"
        @clear="clearDates"
      />
      <button type="button" class="btn-primary" @click="createOpen = true">New transaction</button>
    </div>
    <TransactionSortSelect v-model:sort="sort" class="lg:hidden" />
    <TransactionTable
      v-model:sort="sort"
      class="hidden lg:block"
      :transactions="result?.content ?? []"
      :loading="loading"
    />
    <TransactionCardList class="lg:hidden" :transactions="result?.content ?? []" :loading="loading" />
    <TransactionPagination
      v-if="result && result.totalElements > 0"
      v-model:page="page"
      :total-pages="result.totalPages"
      :total-elements="result.totalElements"
    />
    <CreateTransactionDialog v-model:open="createOpen" @created="handleCreated" />
  </main>
</template>
