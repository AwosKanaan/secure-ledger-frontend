<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toaster } from 'vue-sonner'
import { useAuth } from './composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, sessionExpired } = useAuth()

watch(isAuthenticated, (signedIn) => {
  if (!signedIn) {
    router.replace(sessionExpired.value ? { name: 'login', query: { redirect: route.fullPath } } : { name: 'login' })
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <RouterView />
    <Toaster rich-colors position="bottom-right" />
  </div>
</template>
