import { setCookie, getCookie, removeCookie } from './cookie'

const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'
const ADMIN_ACCESS_KEY = 'adminAccessToken'
const ADMIN_REFRESH_KEY = 'adminRefreshToken'

// ---------- Client tokens ----------
export const getAccessToken = () => getCookie(ACCESS_KEY)
export const getRefreshToken = () => getCookie(REFRESH_KEY)
export const setTokens = ({ accessToken, refreshToken }) => {
  setCookie(ACCESS_KEY, accessToken)
  setCookie(REFRESH_KEY, refreshToken, 7)
}
export const removeTokens = () => {
  removeCookie(ACCESS_KEY)
  removeCookie(REFRESH_KEY)
}

// ---------- Admin tokens ----------
export const getAdminAccessToken = () => getCookie(ADMIN_ACCESS_KEY)
export const getAdminRefreshToken = () => getCookie(ADMIN_REFRESH_KEY)
export const setAdminTokens = ({ accessToken, refreshToken }) => {
  setCookie(ADMIN_ACCESS_KEY, accessToken)
  setCookie(ADMIN_REFRESH_KEY, refreshToken, 7)
}
export const removeAdminTokens = () => {
  removeCookie(ADMIN_ACCESS_KEY)
  removeCookie(ADMIN_REFRESH_KEY)
}
