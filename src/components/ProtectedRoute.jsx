import React from "react";
// Importar Navigate para redirección
import { Navigate } from "react-router-dom";
// Importar store de autenticación
import { useAuthStore } from "../store/useAuthStore";

/**
 * Componente de Ruta Protegida (ProtectedRoute).
 * 
 * Wrapper para rutas que requieren que el usuario haya iniciado sesión.
 * Si el usuario no está autenticado, lo redirige a la página de login.
 */
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
