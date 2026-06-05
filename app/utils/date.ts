export const formatChatDate = (dateStr: string, locale = 'es') => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()

  // Reset hours to compare only dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (compareDate.getTime() === today.getTime()) {
    return locale === 'es' ? 'Hoy' : 'Today'
  }

  if (compareDate.getTime() === yesterday.getTime()) {
    return locale === 'es' ? 'Ayer' : 'Yesterday'
  }

  // Same year: Day, Date Month (e.g., Lunes, 19 de mayo)
  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }

  // Different year: Full date
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export const formatMessageTime = (dateStr: string) => {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return ''
  }
}

export const isDifferentDay = (date1: string, date2: string) => {
  if (!date1 || !date2) return true
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return (
    d1.getFullYear() !== d2.getFullYear() ||
    d1.getMonth() !== d2.getMonth() ||
    d1.getDate() !== d2.getDate()
  )
}
