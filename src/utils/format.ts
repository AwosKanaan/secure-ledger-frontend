import { friendlyFormatIBAN } from 'ibantools'
import { currencyDecimals } from './currency'

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso))
}

export function formatAmount(amount: Intl.StringNumericLiteral, currency: string): string {
  const decimals = currencyDecimals(currency)
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(amount)
}

export function formatIban(iban: string): string {
  return friendlyFormatIBAN(iban) ?? iban
}
