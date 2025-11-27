import React, { useState } from "react";
// Importar hooks de navegación y stores
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { authAPI } from "../services/api";
// Importar toast para notificaciones
import { toast } from "react-toastify";

/**
 * Componente de Inicio de Sesión (Login).
 * 
 * Permite a los usuarios autenticarse en la aplicación.
 * Funcionalidades:
 * 1. Formulario para ingresar email y contraseña.
 * 2. Validación básica de campos.
 * 3. Comunicación con la API de backend para autenticación.
 * 4. Manejo de errores y estados de carga.
 * 5. Redirección al home tras un login exitoso.
 */
const Login = () => {
    // Estado local para los campos del formulario
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    // Estados para manejo de UI (error y carga)
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    // Obtener función de login del store global
    const login = useAuthStore((state) => state.login);

    // Actualizar estado al escribir en los inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Realizar petición de login al backend
            const response = await authAPI.login(formData);

            if (response.success) {
                // Si es exitoso, actualizar el store global con usuario y token
                login(response.data.user, response.data.token);
                toast.success(`¡Bienvenido de nuevo, ${response.data.user.nombre}!`);
                // Redirigir a la página principal
                navigate("/");
            }
        } catch (err) {
            // Manejar errores (credenciales inválidas, error de servidor, etc.)
            setError(err.message || "Error al iniciar sesión");
            toast.error(err.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Inicia sesión en tu cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿No tienes una cuenta?{" "}
                        <Link
                            to="/register"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>

                {/* Formulario de Login */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Mensaje de error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link
                                to="/forgot-password"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
