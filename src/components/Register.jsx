import React, { useState } from "react";
// Importar hooks de navegación y stores
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { authAPI } from "../services/api";
// Importar toast para notificaciones
import { toast } from "react-toastify";

/**
 * Componente de Registro (Register).
 * 
 * Permite a nuevos usuarios crear una cuenta en la plataforma.
 * Funcionalidades:
 * 1. Formulario completo de registro (Nombre, Apellido, Email, Password).
 * 2. Validación de coincidencia de contraseñas.
 * 3. Comunicación con API de registro.
 * 4. Manejo de flujo de verificación de email.
 */
const Register = () => {
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    // Obtener función de login (aunque en este flujo se pide verificación primero)
    const login = useAuthStore((state) => state.login);

    // Actualizar estado al escribir en inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validación local: Contraseñas deben coincidir
        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        try {
            // Preparar datos para enviar (excluyendo confirmPassword que es solo para validación frontend)
            const { confirmPassword, ...registerData } = formData;

            // Llamar a la API de registro
            const response = await authAPI.register(registerData);

            if (response.success) {
                // Registro exitoso
                toast.success("¡Registro exitoso! Por favor verifica tu email.");
                setError("");

                // Limpiar formulario excepto email para feedback visual
                setFormData({
                    nombre: "",
                    apellido: "",
                    email: response.data.email,
                    password: "",
                    confirmPassword: "",
                });

                // Mostrar instrucciones claras sobre el siguiente paso (verificación de email)
                setError(`Hemos enviado un email de verificación a ${response.data.email}. Por favor revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.`);
            }
        } catch (err) {
            // Manejar errores de registro (ej. email ya existe)
            setError(err.message || "Error al registrarse");
            toast.error(err.message || "Error al registrarse");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Crear una cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>

                {/* Formulario de Registro */}
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
                                name="nombre"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="apellido"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirmar contraseña"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? "Registrando..." : "Registrarse"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
