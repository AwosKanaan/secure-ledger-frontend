export const GENERIC_ERROR = 'Something went wrong. Please try again.'

export const IDEMPOTENCY_KEY_REUSED = 'IDEMPOTENCY_KEY_REUSED'

export class ApiError extends Error {
  readonly status: number
  readonly code: string | null
  readonly fieldErrors: Record<string, string>

  constructor(status: number, message: string, code: string | null = null, fieldErrors: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof ApiError ? error.message : GENERIC_ERROR
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401
}
