// Importar create de zustand
import { create } from "zustand";
// Importar persist para persistir el estado
import { persist } from "zustand/middleware";

// Crear el store del carrito
export const useCartStore = create(
    persist(
        (set, get) => ({
            // Estado inicial: carritos por usuario, usuario actual, estado del drawer
            carts: {}, // Estructura: { userId: [items] }
            currentUser: null, // ID del usuario actual o null para invitados
            isOpen: false,

            // Acción para establecer el usuario actual
            setUser: (userId) => set({ currentUser: userId }),

            // Helper para obtener el carrito del usuario actual
            getCurrentCart: () => {
                const { carts, currentUser } = get();
                const userKey = currentUser || "guest";
                return carts[userKey] || [];
            },

            // Acción para agregar item al carrito
            addItem: (product) =>
                set((state) => {
                    const userKey = state.currentUser || "guest";
                    const currentCart = state.carts[userKey] || [];

                    // Verificar si el producto ya existe en el carrito
                    const existingItem = currentCart.find(
                        (item) => item.id === product.id
                    );

                    let newCart;
                    if (existingItem) {
                        // Si existe, incrementar cantidad
                        newCart = currentCart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        );
                    } else {
                        // Si no existe, agregarlo con cantidad 1
                        newCart = [...currentCart, { ...product, quantity: 1 }];
                    }

                    // Actualizar el estado de carritos
                    return {
                        carts: {
                            ...state.carts,
                            [userKey]: newCart,
                        },
                        isOpen: true, // Abrir el drawer al agregar
                    };
                }),

            // Acción para eliminar item del carrito
            removeItem: (productId) =>
                set((state) => {
                    const userKey = state.currentUser || "guest";
                    const currentCart = state.carts[userKey] || [];

                    // Filtrar el producto a eliminar
                    const newCart = currentCart.filter(
                        (item) => item.id !== productId
                    );

                    return {
                        carts: {
                            ...state.carts,
                            [userKey]: newCart,
                        },
                    };
                }),

            // Acción para actualizar cantidad de un item
            updateQuantity: (productId, quantity) =>
                set((state) => {
                    const userKey = state.currentUser || "guest";
                    const currentCart = state.carts[userKey] || [];

                    // Actualizar cantidad, asegurando que sea al menos 1
                    const newCart = currentCart.map((item) =>
                        item.id === productId
                            ? { ...item, quantity: Math.max(1, quantity) }
                            : item
                    );

                    return {
                        carts: {
                            ...state.carts,
                            [userKey]: newCart,
                        },
                    };
                }),

            // Acción para limpiar el carrito actual
            clearCart: () =>
                set((state) => {
                    const userKey = state.currentUser || "guest";
                    return {
                        carts: {
                            ...state.carts,
                            [userKey]: [],
                        },
                    };
                }),

            // Acciones para abrir/cerrar el drawer
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            closeCart: () => set({ isOpen: false }),
            openCart: () => set({ isOpen: true }), // Nueva acción explícita para abrir
        }),
        {
            name: "cart-storage", // Nombre de la clave en localStorage
            // Opcional: configurar qué parte del estado persistir si fuera necesario
            // partialize: (state) => ({ carts: state.carts }), 
        }
    )
);
