import { removeCookie } from './cookie'

const ACCESS_KEY = 'accessToken'
const ADMIN_ACCESS_KEY = 'adminAccessToken'

export const removeTokens = () => {
  removeCookie(ACCESS_KEY)
}

export const removeAdminTokens = () => {
  removeCookie(ADMIN_ACCESS_KEY)
}