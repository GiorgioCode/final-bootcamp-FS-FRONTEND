// Importar create de zustand para crear el store
import { create } from "zustand";
// Importar persist para persistir el estado en localStorage
import { persist } from "zustand/middleware";

// Crear el store de autenticación
export const useAuthStore = create(
    persist(
        (set) => ({
            // Estado inicial: usuario nulo y no autenticado
            user: null,
            isAuthenticated: false,

            // Acción para iniciar sesión
            login: (userData, token) => {
                // Guardar token en sessionStorage
                sessionStorage.setItem("authToken", token);
                // Actualizar estado
                set({
                    user: userData,
                    isAuthenticated: true,
                });
            },

            // Acción para cerrar sesión
            logout: () => {
                // Eliminar token de sessionStorage
                sessionStorage.removeItem("authToken");
                // Resetear estado
                set({
                    user: null,
                    isAuthenticated: false,
                });
            },

            // Acción para actualizar datos del usuario
            updateUser: (userData) => {
                set((state) => ({
                    user: { ...state.user, ...userData },
                }));
            },
        }),
        {
            name: "auth-storage", // Nombre de la clave en localStorage
            getStorage: () => sessionStorage, // Usar sessionStorage en lugar de localStorage
        }
    )
);
