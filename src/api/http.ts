import { useAuth } from '../composables/useAuth'
import { ApiError, GENERIC_ERROR } from './errors'

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

interface ErrorBody {
  code?: string
  message?: string
  errors?: { field: string; message: string }[]
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, expireSession } = useAuth()
  const headers = new Headers(options.headers)
  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }
  if (token.value) {
    headers.set('Authorization', `Bearer ${token.value}`)
  }

  let response: Response
  try {
    response = await fetch(BASE_URL + path, {
      method: options.method ?? 'GET',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.')
  }

  if (response.ok) {
    return (await response.json()) as T
  }

  const body: ErrorBody | null = await response.json().catch(() => null)
  if (response.status === 401 && token.value) {
    expireSession()
  }
  throw new ApiError(
    response.status,
    body?.message ?? GENERIC_ERROR,
    body?.code ?? null,
    Object.fromEntries((body?.errors ?? []).map((error) => [error.field, error.message])),
  )
}
