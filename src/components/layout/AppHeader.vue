<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'

const { signOut } = useAuth()
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <span class="text-lg font-semibold">Secure Ledger</span>
      <button type="button" class="btn-secondary" @click="signOut">Sign out</button>
    </div>
  </header>
</template>
