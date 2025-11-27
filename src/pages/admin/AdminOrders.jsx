import React, { useState, useEffect } from "react";
// Importar API de órdenes
import { ordersAPI } from "../../services/api";
// Importar iconos
import { ShoppingBag, Calendar, DollarSign, User, CheckCircle, Clock, XCircle, Trash2 } from "lucide-react";
// Importar toast para notificaciones
import { toast } from "react-toastify";

/**
 * Página de Gestión de Órdenes (AdminOrders).
 * 
 * Permite a los administradores ver y gestionar todas las órdenes del sistema.
 * Funcionalidades:
 * 1. Listado completo de órdenes con detalles (ID, Usuario, Fecha, Total, Estado).
 * 2. Eliminación de órdenes.
 * 3. Visualización de estado (Completado, Pendiente, Cancelado).
 */
const AdminOrders = () => {
    // Estado para almacenar la lista de órdenes
    const [orders, setOrders] = useState([]);
    // Estado para controlar el indicador de carga
    const [loading, setLoading] = useState(true);

    // Función asíncrona para obtener las órdenes desde la API
    const loadOrders = async () => {
        try {
            setLoading(true); // Activar loading
            const data = await ordersAPI.getAll(); // Llamada al backend
            setOrders(data); // Actualizar estado con los datos recibidos
        } catch (error) {
            toast.error("Error al cargar órdenes");
        } finally {
            setLoading(false); // Desactivar loading
        }
    };

    // Efecto para cargar las órdenes al montar el componente
    useEffect(() => {
        loadOrders();
    }, []);

    // Manejar eliminación de orden
    const handleDelete = async (id) => {
        // Confirmación de seguridad
        if (window.confirm("¿Estás seguro de eliminar esta orden?")) {
            try {
                await ordersAPI.delete(id); // Llamada a la API de eliminación
                toast.success("Orden eliminada exitosamente");
                loadOrders(); // Recargar la lista para reflejar cambios
            } catch (error) {
                toast.error("Error al eliminar orden");
            }
        }
    };

    if (loading) return <div className="text-center py-8">Cargando...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <ShoppingBag className="mr-2 h-6 w-6" />
                Gestión de Órdenes
            </h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Orden</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">
                                        {order._id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-900">
                                            <User className="h-4 w-4 mr-2 text-gray-400" />
                                            {order.user ? `${order.user.nombre} ${order.user.apellido}` : 'Usuario eliminado'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm font-medium text-gray-900">
                                            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                                            {order.total.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {order.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> :
                                                order.status === 'pending' ? <Clock className="h-3 w-3 mr-1" /> :
                                                    <XCircle className="h-3 w-3 mr-1" />}
                                            {order.status === 'completed' ? 'Completado' :
                                                order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(order._id)}
                                            className="text-red-600 hover:text-red-900"
                                            title="Eliminar orden"
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

export default AdminOrders;
