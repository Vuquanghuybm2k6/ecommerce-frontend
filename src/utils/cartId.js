export const getCartId = () => localStorage.getItem('cartId')
export const setCartId = (id) => localStorage.setItem('cartId', id)
export const removeCartId = () => localStorage.removeItem('cartId')