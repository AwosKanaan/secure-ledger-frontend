import { ENDPOINTS } from './endpoints'
import { request } from './http'
import type { NewTransaction, Page, Transaction, TransactionQuery } from './types'

export const TRANSACTIONS_KEY = ['transactions'] as const

export function listTransactions(query: TransactionQuery, signal?: AbortSignal): Promise<Page<Transaction>> {
  const params = new URLSearchParams({ page: String(query.page), size: String(query.size), sort: query.sort })
  if (query.startDate) {
    params.set('startDate', query.startDate)
  }
  if (query.endDate) {
    params.set('endDate', query.endDate)
  }
  return request<Page<Transaction>>(`${ENDPOINTS.transactions}?${params}`, { signal })
}

export function createTransaction(transaction: NewTransaction, idempotencyKey: string): Promise<Transaction> {
  return request<Transaction>(ENDPOINTS.transactions, {
    method: 'POST',
    body: transaction,
    headers: { 'Idempotency-Key': idempotencyKey },
  })
}
