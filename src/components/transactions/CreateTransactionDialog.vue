<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue'
import type { Transaction } from '../../api/types'
import { useCreateTransaction } from '../../composables/useCreateTransaction'
import { CURRENCIES } from '../../utils/currency'
import FormField from '../ui/FormField.vue'

const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ created: [transaction: Transaction] }>()

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const { form, errors, formError, submitting, alreadySaved, submit, submitAsNew, reset } = useCreateTransaction()

const submitLabel = computed(() => {
  if (submitting.value) {
    return 'Saving…'
  }
  return alreadySaved.value ? 'Save as new transaction' : 'Save transaction'
})

watch(open, (isOpen) => {
  if (isOpen) {
    reset()
    dialog.value?.showModal()
  } else {
    dialog.value?.close()
  }
})

async function handleSubmit() {
  const created = await (alreadySaved.value ? submitAsNew() : submit())
  if (created) {
    emit('created', created)
    open.value = false
  }
}
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg bg-white p-0 shadow-xl backdrop:bg-slate-900/50"
    aria-labelledby="create-transaction-title"
    @close="open = false"
  >
    <form class="space-y-4 p-6" novalidate @submit.prevent="handleSubmit">
      <h2 id="create-transaction-title" class="text-lg font-semibold">New transaction</h2>
      <p v-if="formError" role="alert" class="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{{ formError }}</p>

      <div class="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <FormField id="amount" label="Amount" :error="errors.amount">
          <input
            id="amount"
            v-model="form.amount"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            placeholder="125.50"
            :aria-invalid="Boolean(errors.amount)"
            :aria-describedby="errors.amount ? 'amount-error' : undefined"
            class="input"
          />
        </FormField>
        <FormField id="currency" label="Currency" :error="errors.currency">
          <select
            id="currency"
            v-model="form.currency"
            :aria-invalid="Boolean(errors.currency)"
            :aria-describedby="errors.currency ? 'currency-error' : undefined"
            class="input"
          >
            <option v-for="code in CURRENCIES" :key="code" :value="code">{{ code }}</option>
          </select>
        </FormField>
      </div>

      <FormField id="counterparty-iban" label="Counterparty IBAN" :error="errors.counterpartyIban">
        <input
          id="counterparty-iban"
          v-model="form.counterpartyIban"
          type="text"
          autocomplete="off"
          placeholder="DE89 3704 0044 0532 0130 00"
          :aria-invalid="Boolean(errors.counterpartyIban)"
          :aria-describedby="errors.counterpartyIban ? 'counterparty-iban-error' : undefined"
          class="input font-mono"
        />
      </FormField>

      <FormField id="description" label="Description (optional)" :error="errors.description">
        <input
          id="description"
          v-model="form.description"
          type="text"
          maxlength="140"
          :aria-invalid="Boolean(errors.description)"
          :aria-describedby="errors.description ? 'description-error' : undefined"
          class="input"
        />
      </FormField>

      <div class="flex justify-end gap-2 pt-2">
        <button type="button" class="btn-secondary" @click="open = false">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="submitting">
          {{ submitLabel }}
        </button>
      </div>
    </form>
  </dialog>
</template>
