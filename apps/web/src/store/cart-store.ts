import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  salePrice: number;
  originalPrice: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getTotal: () => number;
  getSavings: () => number;
}

/**
 * Global Cart state with Zustand.
 * Persists in localStorage so items remain after refresh.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === product.id);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            isOpen: true, // Open cart when adding item
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: product.id,
                title: product.title,
                salePrice: product.salePrice,
                originalPrice: product.originalPrice,
                image: product.images[0],
                quantity: 1,
              },
            ],
            isOpen: true,
          });
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, delta) => {
        const items = get().items;
        set({
          items: items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
          ),
        });
      },

      toggleCart: () => set({ isOpen: !get().isOpen }),
      
      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((acc, item) => acc + item.salePrice * item.quantity, 0);
      },

      getSavings: () => {
        return get().items.reduce(
          (acc, item) => acc + (item.originalPrice - item.salePrice) * item.quantity,
          0
        );
      },
    }),
    {
      name: "merma-cart",
      // Only persist items, not the isOpen state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
