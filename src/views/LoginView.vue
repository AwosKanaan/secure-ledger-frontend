<script setup lang="ts">
import { shallowRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../api/auth'
import { errorMessage } from '../api/errors'
import type { Credentials } from '../api/types'
import LoginForm from '../components/auth/LoginForm.vue'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { signIn, sessionExpired } = useAuth()

const submitting = shallowRef(false)
const error = shallowRef('')

async function handleSubmit(credentials: Credentials) {
  submitting.value = true
  error.value = ''
  try {
    const { accessToken, expiresIn } = await login(credentials)
    signIn(accessToken, expiresIn)
    await router.push(typeof route.query.redirect === 'string' ? route.query.redirect : { name: 'dashboard' })
  } catch (failure) {
    error.value = errorMessage(failure)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center px-4">
    <div class="w-full max-w-sm space-y-6 rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 class="text-xl font-semibold">Sign in to Secure Ledger</h1>
      <p v-if="sessionExpired && !error" role="status" class="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
        Your session has expired. Please sign in again.
      </p>
      <LoginForm :submitting="submitting" :error="error" @submit="handleSubmit" />
    </div>
  </main>
</template>
