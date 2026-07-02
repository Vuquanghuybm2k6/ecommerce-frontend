const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'
const ADMIN_ACCESS_KEY = 'adminAccessToken'
const ADMIN_REFRESH_KEY = 'adminRefreshToken'

// ---------- Client tokens ----------
export const getAccessToken = () => localStorage.getItem(ACCESS_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY)
export const setTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem(ACCESS_KEY, accessToken)
  localStorage.setItem(REFRESH_KEY, refreshToken)
}
export const removeTokens = () => {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

// ---------- Admin tokens ----------
export const getAdminAccessToken = () => localStorage.getItem(ADMIN_ACCESS_KEY)
export const getAdminRefreshToken = () => localStorage.getItem(ADMIN_REFRESH_KEY)
export const setAdminTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem(ADMIN_ACCESS_KEY, accessToken)
  localStorage.setItem(ADMIN_REFRESH_KEY, refreshToken)
}
export const removeAdminTokens = () => {
  localStorage.removeItem(ADMIN_ACCESS_KEY)
  localStorage.removeItem(ADMIN_REFRESH_KEY)
}