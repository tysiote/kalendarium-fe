export const getCookieValue = (name) => {
  const escapedName = name.replace(/[.*+${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedName}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : ''
}

export const setCookieValue = (name, value, days) => {
  const expires = new Date()
  expires.setTime(expires.getDate() + days)

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`
}
