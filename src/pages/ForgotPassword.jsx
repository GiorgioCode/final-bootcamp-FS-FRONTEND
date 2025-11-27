import React, { useState } from "react";
import { authAPI } from "../services/api";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Página de Recuperación de Contraseña (ForgotPassword).
 * 
 * Permite al usuario solicitar un enlace de restablecimiento de contraseña.
 * Envía el correo electrónico a la API, que se encarga de enviar el email.
 */
const ForgotPassword = () => {
    // Estado para el campo de email
    const [email, setEmail] = useState("");
    // Estado para controlar el indicador de carga durante el envío
    const [loading, setLoading] = useState(false);
    // Estado para mostrar mensajes de éxito
    const [message, setMessage] = useState("");
    // Estado para mostrar mensajes de error
    const [error, setError] = useState("");

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir recarga de la página
        setLoading(true); // Activar estado de carga
        setMessage(""); // Limpiar mensajes anteriores
        setError("");

        try {
            // Llamada a la API para solicitar recuperación de contraseña
            await authAPI.forgotPassword(email);
            // Mostrar mensaje de éxito si la API responde correctamente
            setMessage("Se ha enviado un enlace de recuperación a tu correo.");
            toast.success("Correo de recuperación enviado");
        } catch (err) {
            // Manejar errores (ej: usuario no encontrado)
            setError(err.message || "Error al procesar la solicitud");
            toast.error(err.message || "Error al procesar la solicitud");
        } finally {
            setLoading(false); // Desactivar estado de carga
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Recuperar Contraseña
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                </div>

                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? "Enviando..." : "Enviar enlace"}
                        </button>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
