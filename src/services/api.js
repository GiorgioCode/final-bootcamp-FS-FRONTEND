/**
 * Configuración y Servicios de API.
 * 
 * Este archivo centraliza todas las comunicaciones con el backend.
 * Incluye:
 * - Configuración base (URL, headers).
 * - Interceptores para manejo de tokens y errores.
 * - Servicios específicos por entidad (Auth, Productos, Órdenes, Usuarios, Pagos).
 */

// URL base de la API (desde variables de entorno o default a localhost)
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Obtiene el token de autenticación del almacenamiento de sesión.
 * @returns {string|null} El token JWT o null si no existe.
 */
const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return sessionStorage.getItem("authToken");
    }
    return null;
};

/**
 * Construye los headers para las peticiones HTTP.
 * @param {boolean} includeAuth - Si true, incluye el header Authorization con el token.
 * @returns {Object} Objeto con los headers configurados.
 */
const getHeaders = (includeAuth = true) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    return headers;
};

/**
 * Maneja la respuesta de las peticiones fetch.
 * - Parsea la respuesta JSON.
 * - Maneja errores HTTP (401, 403, 500, etc.).
 * - Gestiona la expiración de sesión (401).
 * @param {Response} response - Objeto Response de fetch.
 * @returns {Promise<any>} Datos de la respuesta parseados.
 * @throws {Error} Si la respuesta no es ok.
 */
const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch (error) {
        console.error("Error parsing response:", error);
        throw new Error("Error al procesar la respuesta del servidor");
    }

    if (!response.ok) {
        // Si el token expiró o es inválido (401), limpiar la sesión y redirigir al login
        if (response.status === 401) {
            if (typeof window !== "undefined") {
                sessionStorage.removeItem("authToken");
                sessionStorage.removeItem("authUser");
                window.location.href = "/login";
            }
        }

        // Construir mensaje de error legible
        const errorMessage =
            data.message ||
            (data.errors && data.errors.length > 0
                ? data.errors.map((e) => e.msg || e.message).join(", ")
                : null) ||
            `HTTP error, status: ${response.status}`;

        throw new Error(errorMessage);
    }
    return data;
};

// ==========================================
// Servicios de Autenticación
// ==========================================
export const authAPI = {
    // Registrar un nuevo usuario
    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: getHeaders(false), // No requiere auth
                body: JSON.stringify(userData),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en registro:", error);
            throw error;
        }
    },

    // Iniciar sesión
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: getHeaders(false), // No requiere auth
                body: JSON.stringify(credentials),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    },

    // Obtener perfil del usuario actual
    getMe: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: getHeaders(true), // Requiere auth
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error obteniendo usuario:", error);
            throw error;
        }
    },

    // Solicitar recuperación de contraseña (envío de email)
    forgotPassword: async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: "POST",
                headers: getHeaders(false),
                body: JSON.stringify({ email }),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en forgotPassword:", error);
            throw error;
        }
    },

    // Restablecer contraseña con token
    resetPassword: async (token, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
                method: "POST",
                headers: getHeaders(false),
                body: JSON.stringify({ password }),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en resetPassword:", error);
            throw error;
        }
    },
};

// ==========================================
// Servicios de Productos
// ==========================================
export const productsAPI = {
    // Obtener todos los productos
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                headers: getHeaders(false), // Público
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error en fetching de productos:", error);
            throw error;
        }
    },
    // Obtener producto por ID
    getById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                headers: getHeaders(false), // Público
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error en fetching de producto ", id, error);
            throw error;
        }
    },
    // Crear producto (Solo Admin)
    create: async (product) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: "POST",
                headers: getHeaders(true),
                body: JSON.stringify(product),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error creando producto:", error);
            throw error;
        }
    },
    // Actualizar producto (Solo Admin)
    update: async (id, product) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: "PUT",
                headers: getHeaders(true),
                body: JSON.stringify(product),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error actualizando producto:", error);
            throw error;
        }
    },
    // Eliminar producto (Solo Admin)
    delete: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: "DELETE",
                headers: getHeaders(true),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error eliminando producto:", error);
            throw error;
        }
    },
};

// ==========================================
// Servicios de Órdenes
// ==========================================
export const ordersAPI = {
    // Crear nueva orden
    create: async (order) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: "POST",
                headers: getHeaders(true),
                body: JSON.stringify(order),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error creando orden:", error);
            throw error;
        }
    },
    // Obtener historial de órdenes del usuario actual
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                headers: getHeaders(true),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error obteniendo órdenes:", error);
            throw error;
        }
    },
    // Obtener todas las órdenes (Solo Admin)
    getAllAdmin: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/admin/all`, {
                headers: getHeaders(true),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error obteniendo todas las órdenes:", error);
            throw error;
        }
    },
    // Eliminar orden (Solo Admin)
    delete: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
                method: "DELETE",
                headers: getHeaders(true),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error eliminando orden:", error);
            throw error;
        }
    },
};

// ==========================================
// Servicios de Usuarios (Admin)
// ==========================================
export const usersAPI = {
    // Obtener todos los usuarios
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: getHeaders(true),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error obteniendo usuarios:", error);
            throw error;
        }
    },
    // Actualizar usuario (ej: cambiar rol)
    update: async (id, userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: "PUT",
                headers: getHeaders(true),
                body: JSON.stringify(userData),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error actualizando usuario:", error);
            throw error;
        }
    },
    // Eliminar usuario
    delete: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: "DELETE",
                headers: getHeaders(true),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error eliminando usuario:", error);
            throw error;
        }
    },
};

// ==========================================
// Servicios de Pagos (MercadoPago)
// ==========================================
export const paymentAPI = {
    // Crear preferencia de pago para iniciar checkout
    createPreference: async (items) => {
        try {
            const response = await fetch(`${API_BASE_URL}/payment/create-preference`, {
                method: "POST",
                headers: getHeaders(true),
                body: JSON.stringify({ items }),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error creando preferencia de pago:", error);
            throw error;
        }
    },
};

// ==========================================
// Utilidades Generales
// ==========================================

// Verificar salud del servidor (Health Check)
export const checkServerHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch (error) {
        console.error("La verificacion de servidor ha fallado", error);
        return false;
    }
};
