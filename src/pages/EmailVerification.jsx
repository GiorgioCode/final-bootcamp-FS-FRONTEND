import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock, Mail } from "lucide-react";

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        setStatus(searchParams.get("status"));
        setEmail(searchParams.get("email"));
    }, [searchParams]);

    if (!status) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const renderContent = () => {
        switch (status) {
            case "success":
                return (
                    <>
                        <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            ¡Email Verificado!
                        </h1>
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            Tu cuenta ha sido verificada exitosamente.
                            {email && (
                                <span className="block mt-2 font-medium">
                                    {email}
                                </span>
                            )}
                        </p>
                        <div className="bg-green-50 rounded-lg p-6 mb-8 w-full max-w-md">
                            <p className="text-green-800 text-center">
                                ✓ Cuenta activada correctamente
                            </p>
                            <p className="text-green-700 text-center text-sm mt-2">
                                Ya puedes iniciar sesión con tus credenciales
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Ir al Login
                        </Link>
                    </>
                );

            case "invalid":
                return (
                    <>
                        <XCircle className="h-20 w-20 text-red-500 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Enlace Inválido
                        </h1>
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            El enlace de verificación no es válido o ya ha sido utilizado.
                        </p>
                        <div className="bg-red-50 rounded-lg p-6 mb-8 w-full max-w-md">
                            <p className="text-red-800 text-center">
                                Por favor solicita un nuevo enlace de verificación.
                            </p>
                        </div>
                    </>
                );

            case "expired":
                return (
                    <>
                        <Clock className="h-20 w-20 text-yellow-500 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Enlace Expirado
                        </h1>
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            El enlace de verificación ha expirado.
                            Los enlaces son válidos por 15 minutos.
                        </p>
                        <div className="bg-yellow-50 rounded-lg p-6 mb-8 w-full max-w-md">
                            <p className="text-yellow-800 text-center">
                                Por favor solicita un nuevo enlace de verificación.
                            </p>
                        </div>
                    </>
                );

            case "error":
                return (
                    <>
                        <XCircle className="h-20 w-20 text-red-500 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Error de Verificación
                        </h1>
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            Ocurrió un error al verificar tu email.
                            Por favor intenta nuevamente.
                        </p>
                    </>
                );

            default:
                return (
                    <>
                        <Mail className="h-20 w-20 text-gray-400 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Estado Desconocido
                        </h1>
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            No pudimos determinar el estado de la verificación.
                        </p>
                    </>
                );
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {renderContent()}
            <div className="mt-6">
                <Link
                    to="/"
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
};

export default EmailVerification;
