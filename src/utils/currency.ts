export const CURRENCIES = Intl.supportedValuesOf('currency')

export function currencyDecimals(currency: string): number {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2
}
