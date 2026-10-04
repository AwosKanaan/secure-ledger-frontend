import { toast } from 'vue-sonner'
import { errorMessage, isUnauthorized } from '../api/errors'

export function reportError(error: unknown) {
  if (!isUnauthorized(error)) {
    toast.error(errorMessage(error))
  }
}
