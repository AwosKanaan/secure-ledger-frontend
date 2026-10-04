<script setup lang="ts">
import type { Transaction } from '../../api/types'
import { formatAmount, formatDate, formatIban } from '../../utils/format'

defineProps<{ transactions: readonly Transaction[]; loading: boolean }>()
</script>

<template>
  <ul class="space-y-2" :class="{ 'opacity-60': loading }" :aria-busy="loading">
    <li
      v-for="transaction in transactions"
      :key="transaction.id"
      class="rounded-lg bg-white p-4 text-sm shadow-sm ring-1 ring-slate-200"
    >
      <div class="flex items-baseline justify-between gap-3">
        <span class="text-slate-500">{{ formatDate(transaction.createdAt) }}</span>
        <span class="font-mono font-medium whitespace-nowrap tabular-nums">
          {{ formatAmount(transaction.amount, transaction.currency) }} {{ transaction.currency }}
        </span>
      </div>
      <p class="mt-1 break-words">{{ transaction.description ?? '—' }}</p>
      <p class="mt-1 font-mono text-xs text-slate-500">{{ formatIban(transaction.counterpartyIban) }}</p>
    </li>
    <li
      v-if="transactions.length === 0"
      class="rounded-lg bg-white px-4 py-10 text-center text-slate-500 shadow-sm ring-1 ring-slate-200"
    >
      {{ loading ? 'Loading transactions…' : 'No transactions found.' }}
    </li>
  </ul>
</template>
