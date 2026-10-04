import { computed, readonly, shallowRef } from 'vue'
import { queryClient } from '../api/queryClient'

const token = shallowRef<string | null>(null)
const sessionExpired = shallowRef(false)
const isAuthenticated = computed(() => token.value !== null)
let expiryTimer: ReturnType<typeof setTimeout> | undefined

function signIn(accessToken: string, expiresInSeconds: number) {
  token.value = accessToken
  sessionExpired.value = false
  expiryTimer = setTimeout(expireSession, expiresInSeconds * 1000)
}

function signOut() {
  clearTimeout(expiryTimer)
  token.value = null
  queryClient.clear()
}

function expireSession() {
  signOut()
  sessionExpired.value = true
}

export function useAuth() {
  return {
    token: readonly(token),
    sessionExpired: readonly(sessionExpired),
    isAuthenticated,
    signIn,
    signOut,
    expireSession,
  }
}
