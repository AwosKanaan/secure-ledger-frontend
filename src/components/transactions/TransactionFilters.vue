<script setup lang="ts">
import FormField from '../ui/FormField.vue'

defineProps<{ error: string }>()
const emit = defineEmits<{ clear: [] }>()
const startDate = defineModel<string>('startDate', { required: true })
const endDate = defineModel<string>('endDate', { required: true })
</script>

<template>
  <div class="space-y-1">
    <div class="flex flex-wrap items-end gap-3">
      <FormField id="start-date" label="From">
        <input
          id="start-date"
          v-model="startDate"
          type="date"
          :max="endDate || undefined"
          :aria-invalid="Boolean(error)"
          class="input"
        />
      </FormField>
      <FormField id="end-date" label="To">
        <input
          id="end-date"
          v-model="endDate"
          type="date"
          :min="startDate || undefined"
          :aria-invalid="Boolean(error)"
          class="input"
        />
      </FormField>
      <button v-if="startDate || endDate" type="button" class="btn-secondary" @click="emit('clear')">Clear dates</button>
    </div>
    <p v-if="error" role="alert" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>
