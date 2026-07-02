import { create } from 'zustand'
import { getCartId, setCartId } from '../utils/cartId'

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
}))

export default useCartStore