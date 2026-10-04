<script setup lang="ts">
defineProps<{ id: string; label: string; error?: string }>()
</script>

<template>
  <div class="space-y-1">
    <label :for="id" class="block text-sm font-medium text-slate-700">{{ label }}</label>
    <slot />
    <p v-if="error" :id="`${id}-error`" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>
