import { electronicFormatIBAN, isValidIBAN } from 'ibantools'
import type { NewTransaction } from '../api/types'

export type TransactionErrors = Partial<Record<keyof NewTransaction, string>>

const AMOUNT_PATTERN = /^\d{1,15}(\.\d{1,4})?$/

export function normalizeTransaction(form: NewTransaction): NewTransaction {
  return {
    amount: form.amount.trim(),
    currency: form.currency,
    description: form.description.trim(),
    counterpartyIban: electronicFormatIBAN(form.counterpartyIban) ?? '',
  }
}

export function validateTransaction(transaction: NewTransaction): TransactionErrors {
  const errors: TransactionErrors = {}
  const { amount, counterpartyIban } = transaction

  if (!amount) {
    errors.amount = 'Enter an amount'
  } else if (!AMOUNT_PATTERN.test(amount)) {
    errors.amount = 'Enter a number such as 125.50, with at most 15 digits before and 4 after the decimal point'
  } else if (Number(amount) <= 0) {
    errors.amount = 'The amount must be greater than 0'
  }

  if (!counterpartyIban) {
    errors.counterpartyIban = 'Enter the counterparty IBAN'
  } else if (!isValidIBAN(counterpartyIban)) {
    errors.counterpartyIban = 'Enter a valid IBAN, e.g. DE89 3704 0044 0532 0130 00'
  }

  return errors
}
