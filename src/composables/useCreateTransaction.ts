import { useQueryClient } from '@tanstack/vue-query'
import { reactive, readonly, shallowRef } from 'vue'
import { ApiError, IDEMPOTENCY_KEY_REUSED, errorMessage, isUnauthorized } from '../api/errors'
import { createTransaction, TRANSACTIONS_KEY } from '../api/transactions'
import type { NewTransaction, Transaction } from '../api/types'
import { normalizeTransaction, validateTransaction, type TransactionErrors } from '../utils/validation'

const ALREADY_SAVED =
  'An earlier attempt from this form was already saved, so these details were not booked. ' +
  'Check the transaction list before saving them as a new transaction.'

function emptyForm(): NewTransaction {
  return { amount: '', currency: 'EUR', description: '', counterpartyIban: '' }
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  const form = reactive(emptyForm())
  const errors = shallowRef<TransactionErrors>({})
  const formError = shallowRef('')
  const submitting = shallowRef(false)
  const alreadySaved = shallowRef(false)
  // same key after edits, so a request that was already saved is not saved again
  let idempotencyKey = crypto.randomUUID()

  function reset() {
    Object.assign(form, emptyForm())
    errors.value = {}
    formError.value = ''
    alreadySaved.value = false
    idempotencyKey = crypto.randomUUID()
  }

  async function submit(): Promise<Transaction | null> {
    const transaction = normalizeTransaction(form)
    formError.value = ''
    errors.value = validateTransaction(transaction)
    if (Object.keys(errors.value).length > 0) {
      return null
    }

    submitting.value = true
    try {
      return await createTransaction(transaction, idempotencyKey)
    } catch (error) {
      handleFailure(error)
      return null
    } finally {
      submitting.value = false
    }
  }

  function handleFailure(error: unknown) {
    if (error instanceof ApiError && error.code === IDEMPOTENCY_KEY_REUSED) {
      alreadySaved.value = true
      formError.value = ALREADY_SAVED
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
    } else if (error instanceof ApiError && Object.keys(error.fieldErrors).length > 0) {
      errors.value = error.fieldErrors
    } else if (!isUnauthorized(error)) {
      formError.value = errorMessage(error)
    }
  }

  function submitAsNew(): Promise<Transaction | null> {
    idempotencyKey = crypto.randomUUID()
    alreadySaved.value = false
    return submit()
  }

  return {
    form,
    errors: readonly(errors),
    formError: readonly(formError),
    submitting: readonly(submitting),
    alreadySaved: readonly(alreadySaved),
    submit,
    submitAsNew,
    reset,
  }
}
