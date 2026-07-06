import { setCookie, getCookie, removeCookie } from './cookie'

const CART_ID_KEY = 'cartId'

export const getCartId = () => getCookie(CART_ID_KEY)
export const setCartId = (id) => setCookie(CART_ID_KEY, id, 30)
export const removeCartId = () => removeCookie(CART_ID_KEY)
