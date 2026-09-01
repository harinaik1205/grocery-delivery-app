import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

interface CartItem {
  _id: string | number;
  item: any;
  count: number;
}

interface CartStore {
  cart: CartItem[];
  addItem: (item: any) => void;
  removeItem: (id: string | number) => void;
  clearCart: () => void;
  getItemCount: (id: string | number) => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [] as CartItem[],
      addItem: item => {
        const currentCart = get().cart;
        const existingItemIndex = currentCart.findIndex(
          cartItem => cartItem._id === item._id,
        );

        if (existingItemIndex >= 0) {
          const updatedCart = [...currentCart];
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            count: updatedCart[existingItemIndex].count + 1,
          };
          set({
            cart: updatedCart,
          });
          return;
        }

        set({
          cart: [...currentCart, { _id: item._id, item, count: 1 }],
        });
      },
      removeItem: id => {
        const currentCart = get().cart;
        const existingItemIndex = currentCart.findIndex(
          cartItem => cartItem?._id === id,
        );

        if (existingItemIndex >= 0) {
          const updatedCart = [...currentCart];
          const existingItem = updatedCart[existingItemIndex];
          if (existingItem.count > 1) {
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              count: updatedCart[existingItemIndex].count - 1,
            };
          } else {
            updatedCart.splice(existingItemIndex, 1);
          }
          set({ cart: updatedCart });
        }
      },
      clearCart: () => {
        set({ cart: [] });
      },
      getItemCount: id => {
        return get().cart.find(cartItem => cartItem._id === id)?.count ?? 0;
      },
      getTotalPrice: () => {
        return get().cart.reduce((total, cartItem) => {
          const price = Number(cartItem.item?.price ?? 0);
          return total + price * cartItem.count;
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
