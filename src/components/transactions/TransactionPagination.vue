<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ totalPages: number; totalElements: number }>()
const page = defineModel<number>('page', { required: true })

const summary = computed(
  () => `Page ${page.value} of ${props.totalPages} · ${props.totalElements} transaction${props.totalElements === 1 ? '' : 's'}`,
)
</script>

<template>
  <nav class="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600" aria-label="Pagination">
    <p>{{ summary }}</p>
    <div class="flex gap-2">
      <button type="button" class="btn-secondary" :disabled="page <= 1" @click="page--">Previous</button>
      <button type="button" class="btn-secondary" :disabled="page >= totalPages" @click="page++">Next</button>
    </div>
  </nav>
</template>
