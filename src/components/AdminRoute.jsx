import React from "react";
// Importar Navigate para redirección
import { Navigate } from "react-router-dom";
// Importar store de autenticación
import { useAuthStore } from "../store/useAuthStore";

const AdminRoute = ({ children }) => {
    // Paso 1: Obtener el usuario actual y su estado de autenticación desde el store global
    const { user, isAuthenticated } = useAuthStore();

    // Paso 2: Verificar permisos
    // Se requiere que el usuario esté autenticado (isAuthenticated === true)
    // Y que tenga la propiedad isAdmin en true
    if (!isAuthenticated || !user?.isAdmin) {
        // Si no cumple con los requisitos, redirigir a la página principal
        // 'replace' evita que el usuario pueda volver atrás con el botón del navegador
        return <Navigate to="/" replace />;
    }

    // Paso 3: Renderizar contenido protegido
    // Si pasa las verificaciones, muestra los componentes hijos (la página de admin)
    return children;
};

export default AdminRoute;
