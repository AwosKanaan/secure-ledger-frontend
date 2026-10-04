<script setup lang="ts">
import { reactive } from 'vue'
import type { Credentials } from '../../api/types'
import FormField from '../ui/FormField.vue'

defineProps<{ submitting: boolean; error: string }>()
const emit = defineEmits<{ submit: [credentials: Credentials] }>()

const credentials = reactive<Credentials>({ email: '', password: '' })
</script>

<template>
  <form class="space-y-4" @submit.prevent="emit('submit', { ...credentials })">
    <p v-if="error" role="alert" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
    <FormField id="email" label="Email">
      <input id="email" v-model="credentials.email" type="email" autocomplete="username" required class="input" />
    </FormField>
    <FormField id="password" label="Password">
      <input
        id="password"
        v-model="credentials.password"
        type="password"
        autocomplete="current-password"
        required
        class="input"
      />
    </FormField>
    <button type="submit" class="btn-primary w-full" :disabled="submitting">
      {{ submitting ? 'Signing in…' : 'Sign in' }}
    </button>
  </form>
</template>
