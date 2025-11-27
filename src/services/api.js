// URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Función para obtener el token de autenticación del sessionStorage
const getAuthToken = () => {
    if (typeof window !== "undefined") {
        return sessionStorage.getItem("authToken");
    }
    return null;
};

// Función para construir headers con autenticación opcional
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

// Función para manejar la respuesta de la API
const handleResponse = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch (error) {
        console.error("Error parsing response:", error);
        throw new Error("Error al procesar la respuesta del servidor");
    }

    if (!response.ok) {
        // Si el token expiró, limpiar la sesión y redirigir al login
        if (response.status === 401) {
            if (typeof window !== "undefined") {
                sessionStorage.removeItem("authToken");
                sessionStorage.removeItem("authUser");
                window.location.href = "/login";
            }
        }

        // Construir mensaje de error
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

// API de Autenticación
export const authAPI = {
    // Registro de usuario
    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: getHeaders(false),
                body: JSON.stringify(userData),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en registro:", error);
            throw error;
        }
    },

    // Inicio de sesión
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: getHeaders(false),
                body: JSON.stringify(credentials),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    },

    // Obtener usuario actual
    getMe: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: getHeaders(true),
            });
            return await handleResponse(response);
        } catch (error) {
            console.error("Error obteniendo usuario:", error);
            throw error;
        }
    },

    // Solicitar recuperación de contraseña
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

    // Restablecer contraseña
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

// API de Productos
export const productsAPI = {
    // Obtener todos los productos
    getAll: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`, {
                headers: getHeaders(false),
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
                headers: getHeaders(false),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error en fetching de producto ", id, error);
            throw error;
        }
    },
    // Crear producto (Admin)
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
    // Actualizar producto (Admin)
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
    // Eliminar producto (Admin)
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

// API de Órdenes
export const ordersAPI = {
    // Crear orden
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
    // Obtener órdenes del usuario
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
    // Obtener todas las órdenes (Admin)
    getAllAdmin: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/all`, {
                headers: getHeaders(true),
            });
            const data = await handleResponse(response);
            return data.data || data;
        } catch (error) {
            console.error("Error obteniendo todas las órdenes:", error);
            throw error;
        }
    },
    // Eliminar orden (Admin)
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

// API de Usuarios (Admin)
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
    // Actualizar usuario
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

// API de Pagos
export const paymentAPI = {
    // Crear preferencia de pago
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

// Verificar salud del servidor
export const checkServerHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch (error) {
        console.error("La verificacion de servidor ha fallado", error);
        return false;
    }
};
