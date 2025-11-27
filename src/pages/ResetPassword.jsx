import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";

const ResetPassword = () => {
    // Obtener el token de la URL (ej: /reset-password/TOKEN_AQUI)
    const { token } = useParams();
    const navigate = useNavigate();

    // Estado para las contraseñas (nueva y confirmación)
    const [passwords, setPasswords] = useState({
        password: "",
        confirmPassword: "",
    });
    // Estado para controlar carga y errores
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación local: verificar que las contraseñas coincidan
        if (passwords.password !== passwords.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Llamada a la API para restablecer la contraseña usando el token
            await authAPI.resetPassword(token, passwords.password);
            toast.success("Contraseña restablecida exitosamente");
            // Redirigir al login después de un éxito
            navigate("/login");
        } catch (err) {
            // Manejar errores (ej: token expirado o inválido)
            setError(err.message || "Error al restablecer la contraseña");
            toast.error(err.message || "Error al restablecer la contraseña");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Restablecer Contraseña
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Ingresa tu nueva contraseña
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Nueva contraseña"
                                value={passwords.password}
                                onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirmar nueva contraseña"
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? "Restableciendo..." : "Restablecer Contraseña"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
