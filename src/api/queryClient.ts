import { QueryCache, QueryClient } from '@tanstack/vue-query'
import { reportError } from '../utils/notifications'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: reportError }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})
