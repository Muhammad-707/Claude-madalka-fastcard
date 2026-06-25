export function formatPrice(value: number, currency = '$'): string {
  return `${currency}${value.toFixed(2)}`
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value)
}
