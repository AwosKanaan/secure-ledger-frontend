export interface Credentials {
  email: string
  password: string
}

export interface TokenResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
}

export interface Transaction {
  id: string
  amount: Intl.StringNumericLiteral
  currency: string
  description: string | null
  counterpartyIban: string
  createdAt: string
}

export interface NewTransaction {
  amount: string
  currency: string
  description: string
  counterpartyIban: string
}

export interface Page<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export const TRANSACTION_SORTS = ['createdAt,desc', 'createdAt,asc', 'amount,desc', 'amount,asc'] as const

export type TransactionSort = (typeof TRANSACTION_SORTS)[number]

export interface TransactionQuery {
  page: number
  size: number
  sort: TransactionSort
  startDate: string
  endDate: string
}
