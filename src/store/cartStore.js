import { create } from 'zustand'
import { getCartId, setCartId, removeCartId } from '../utils/cartId'

const useCartStore = create((set) => ({
  cartId: getCartId(),
  totalQuantity: 0,
  cart: null,

  updateCartId: (id) => {
    setCartId(id)
    set({ cartId: id })
  },

  setTotalQuantity: (qty) => set({ totalQuantity: qty }),

  setCart: (cart) => set({ cart }),

  resetCart: () => {
    removeCartId()
    set({ cartId: null, totalQuantity: 0, cart: null })
  },
}))

export default useCartStore