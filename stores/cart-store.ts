import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    productId: string
    variantId: string | null
    name: string
    price: number
    image: string | null
    quantity: number
    sku: string
    maxStock: number
}

interface CartState {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
    removeItem: (productId: string, variantId?: string | null) => void
    updateQuantity: (productId: string, quantity: number, variantId?: string | null) => void
    clearCart: () => void
    totalItems: () => number
    subtotal: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item, quantity = 1) => {
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (i) => i.productId === item.productId && i.variantId === item.variantId
                    )

                    if (existingIndex > -1) {
                        const updated = [...state.items]
                        const newQty = Math.min(
                            updated[existingIndex].quantity + quantity,
                            item.maxStock
                        )
                        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty }
                        return { items: updated }
                    }

                    return {
                        items: [
                            ...state.items,
                            { ...item, quantity: Math.min(quantity, item.maxStock) },
                        ],
                    }
                })
            },

            removeItem: (productId, variantId = null) => {
                set((state) => ({
                    items: state.items.filter(
                        (i) => !(i.productId === productId && i.variantId === variantId)
                    ),
                }))
            },

            updateQuantity: (productId, quantity, variantId = null) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter(
                                (i) => !(i.productId === productId && i.variantId === variantId)
                            ),
                        }
                    }

                    return {
                        items: state.items.map((i) =>
                            i.productId === productId && i.variantId === variantId
                                ? { ...i, quantity: Math.min(quantity, i.maxStock) }
                                : i
                        ),
                    }
                })
            },

            clearCart: () => set({ items: [] }),

            totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

            subtotal: () =>
                get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        }),
        {
            name: 'fom-cart',
        }
    )
)
