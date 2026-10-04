import { ENDPOINTS } from './endpoints'
import { request } from './http'
import type { Credentials, TokenResponse } from './types'

export function login(credentials: Credentials): Promise<TokenResponse> {
  return request<TokenResponse>(ENDPOINTS.login, { method: 'POST', body: credentials })
}
