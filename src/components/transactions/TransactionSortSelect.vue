<script setup lang="ts">
import type { TransactionSort } from '../../api/types'
import FormField from '../ui/FormField.vue'

const OPTIONS: { value: TransactionSort; label: string }[] = [
  { value: 'createdAt,desc', label: 'Newest first' },
  { value: 'createdAt,asc', label: 'Oldest first' },
  { value: 'amount,desc', label: 'Highest amount' },
  { value: 'amount,asc', label: 'Lowest amount' },
]

const sort = defineModel<TransactionSort>('sort', { required: true })
</script>

<template>
  <FormField id="sort" label="Sort by">
    <select id="sort" v-model="sort" class="input">
      <option v-for="option in OPTIONS" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </FormField>
</template>
