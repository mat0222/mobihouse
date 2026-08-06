/** Emails autorizados a recibir rol admin en el primer login (también van en firestore.rules). */
export const ADMIN_EMAILS = ['andres@mobihouse.com'] as const

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return (ADMIN_EMAILS as readonly string[]).includes(email.toLowerCase())
}

export function sanitizeText(value: string, maxLength = 500): string {
  return value.replace(/[<>]/g, '').trim().slice(0, maxLength)
}

export function sanitizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return ''
    }
    return url.toString().slice(0, 2000)
  } catch {
    return ''
  }
}

export function isStrongEnoughPassword(password: string): boolean {
  return password.length >= 8
}
