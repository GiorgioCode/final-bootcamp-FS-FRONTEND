import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Store de Tema (useThemeStore).
 * 
 * Gestiona el estado del tema (claro/oscuro) de la aplicación utilizando Zustand.
 * Persiste la preferencia del usuario en localStorage para mantenerla entre sesiones.
 * También sincroniza la clase 'dark' en el elemento <html> del documento.
 */
export const useThemeStore = create(
    persist(
        (set) => ({
            // Estado inicial: tema claro por defecto
            theme: "light",

            /**
             * Alterna entre tema claro y oscuro.
             * Actualiza el estado y modifica la clase 'dark' en el DOM.
             */
            toggleTheme: () =>
                set((state) => {
                    const newTheme = state.theme === "light" ? "dark" : "light";
                    // Sincronización manual con el DOM para Tailwind dark mode
                    if (newTheme === "dark") {
                        document.documentElement.classList.add("dark");
                    } else {
                        document.documentElement.classList.remove("dark");
                    }
                    return { theme: newTheme };
                }),

            /**
             * Establece un tema específico.
             * @param {string} theme - 'light' o 'dark'.
             */
            setTheme: (theme) => {
                if (theme === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
                set({ theme });
            },
        }),
        {
            name: "theme-storage", // Nombre de la clave en localStorage

            // Hook que se ejecuta al rehidratar el estado desde localStorage
            // Asegura que el DOM refleje el tema guardado al recargar la página
            onRehydrateStorage: () => (state) => {
                if (state && state.theme === "dark") {
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                }
            },
        }
    )
);
