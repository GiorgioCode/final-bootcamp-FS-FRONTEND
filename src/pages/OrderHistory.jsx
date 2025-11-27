import React, { useEffect, useState } from "react";
// Importar API de usuarios
import { usersAPI } from "../services/api";
// Importar store de autenticación
import { useAuthStore } from "../store/useAuthStore";
// Importar iconos
import { Package, Calendar, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";

/**
 * Página de Historial de Órdenes (OrderHistory).
 * 
 * Muestra las órdenes realizadas por el usuario autenticado.
 * Funcionalidades:
 * 1. Obtiene el ID del usuario actual.
 * 2. Carga las órdenes asociadas a ese usuario.
 * 3. Muestra detalles de cada orden (productos, total, estado).
 */
const OrderHistory = () => {
    // Estado para almacenar la lista de órdenes del usuario
    const [orders, setOrders] = useState([]);
    // Estado para controlar el indicador de carga
    const [loading, setLoading] = useState(true);
    // Estado para manejar errores de carga
    const [error, setError] = useState(null);

    // Obtener el usuario actual desde el store de autenticación
    const { user } = useAuthStore();

    // Efecto para cargar el historial de órdenes cuando el usuario está disponible
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Llamada a la API para obtener las órdenes del usuario específico
                const data = await usersAPI.getOrders(user.id);
                setOrders(data); // Guardar órdenes en el estado
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Error al cargar el historial de órdenes");
            } finally {
                setLoading(false); // Finalizar carga
            }
        };

        // Solo intentar cargar si tenemos un ID de usuario válido
        if (user?.id) {
            fetchOrders();
        }
    }, [user]); // Dependencia: user (se ejecuta si cambia el usuario)

    // Renderizar estado de carga
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <Package className="mr-3 h-8 w-8 text-indigo-600" />
                Mis Órdenes
            </h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                    <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No has realizado ninguna orden aún.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            {/* Cabecera de la orden */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Orden ID</p>
                                    <p className="font-mono text-sm font-medium text-gray-900">{order._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Fecha</p>
                                    <div className="flex items-center text-sm font-medium text-gray-900">
                                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total</p>
                                    <div className="flex items-center text-sm font-bold text-indigo-600">
                                        <DollarSign className="h-4 w-4 mr-1" />
                                        {order.total.toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {order.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> :
                                            order.status === 'pending' ? <Clock className="h-3 w-3 mr-1" /> :
                                                <XCircle className="h-3 w-3 mr-1" />}
                                        {order.status === 'completed' ? 'Completado' :
                                            order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                                    </span>
                                </div>
                            </div>

                            {/* Lista de productos */}
                            <div className="px-6 py-4">
                                <ul className="divide-y divide-gray-100">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="py-4 flex items-center">
                                            <div className="flex-shrink-0 h-16 w-16 border border-gray-200 rounded-md overflow-hidden">
                                                {/* Imagen placeholder si no hay imagen real */}
                                                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                                                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                            </div>
                                            <div className="ml-4 text-sm font-medium text-gray-900">
                                                ${item.unit_price.toLocaleString()}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
