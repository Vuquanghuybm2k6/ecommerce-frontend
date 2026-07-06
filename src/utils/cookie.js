export const setCookie = (name, value, days = 0) => {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};path=/;SameSite=Lax`
  if (days > 0) {
    const date = new Date()
    date.setDate(date.getDate() + days)
    cookie += `;expires=${date.toUTCString()}`
  }
  document.cookie = cookie
}

export const getCookie = (name) => {
  const cookies = document.cookie.split(';').map(c => c.trim())
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.split('=')
    if (decodeURIComponent(cookieName) === name) {
      return decodeURIComponent(rest.join('='))
    }
  }
  return null
}

export const removeCookie = (name) => {
  document.cookie = `${encodeURIComponent(name)}=;path=/;SameSite=Lax;expires=Thu, 01 Jan 1970 00:00:00 UTC`
}
