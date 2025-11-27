import React, { useState, useEffect } from "react";
// Importar API de usuarios
import { usersAPI } from "../../services/api";
// Importar iconos
import { Users, Trash2, Shield, ShieldOff, Mail, User } from "lucide-react";
// Importar toast para notificaciones
import { toast } from "react-toastify";

const AdminUsers = () => {
    // Estados para usuarios y loading
    // Estado para almacenar la lista de usuarios
    const [users, setUsers] = useState([]);
    // Estado para controlar el indicador de carga
    const [loading, setLoading] = useState(true);

    // Efecto para cargar los usuarios al montar el componente
    useEffect(() => {
        loadUsers();
    }, []);

    // Función asíncrona para obtener los usuarios desde la API
    const loadUsers = async () => {
        try {
            // No es necesario setear loading a true aquí si ya es true inicialmente,
            // pero es buena práctica si se reutiliza la función.
            const data = await usersAPI.getAll(); // Llamada al backend
            setUsers(data); // Actualizar estado
        } catch (error) {
            toast.error("Error al cargar usuarios");
        } finally {
            setLoading(false); // Desactivar loading
        }
    };

    // Manejar eliminación de usuario
    const handleDelete = async (id) => {
        // Confirmación de seguridad
        if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
            try {
                await usersAPI.delete(id); // Llamada a la API de eliminación
                toast.success("Usuario eliminado exitosamente");
                loadUsers(); // Recargar la lista para reflejar cambios
            } catch (error) {
                toast.error("Error al eliminar usuario");
            }
        }
    };

    // Manejar cambio de rol (admin/user)
    const handleToggleAdmin = async (user) => {
        try {
            // Llamada a la API de actualización invirtiendo el valor actual de isAdmin
            await usersAPI.update(user._id, { isAdmin: !user.isAdmin });

            // Notificación de éxito con el nuevo rol
            toast.success(`Rol de usuario actualizado a ${!user.isAdmin ? 'Administrador' : 'Usuario'}`);

            loadUsers(); // Recargar la lista para reflejar cambios
        } catch (error) {
            toast.error("Error al actualizar rol de usuario");
        }
    };

    if (loading) return <div className="text-center py-8">Cargando...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="mr-2 h-6 w-6" />
                Gestión de Usuarios
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.nombre} {user.apellido}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-green-100 text-green-800"
                                            }`}>
                                            {user.isAdmin ? "Administrador" : "Usuario"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleToggleAdmin(user)}
                                            className={`mr-4 ${user.isAdmin ? "text-orange-600 hover:text-orange-900" : "text-indigo-600 hover:text-indigo-900"}`}
                                            title={user.isAdmin ? "Quitar permisos de admin" : "Hacer administrador"}
                                        >
                                            {user.isAdmin ? <ShieldOff className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Eliminar usuario"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
