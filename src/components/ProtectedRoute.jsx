import React from "react";
// Importar Navigate para redirección
import { Navigate } from "react-router-dom";
// Importar store de autenticación
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ children }) => {
    // Obtener estado de autenticación
    const { isAuthenticated } = useAuthStore();

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, renderizar el contenido protegido
    return children;
};

export default ProtectedRoute;
