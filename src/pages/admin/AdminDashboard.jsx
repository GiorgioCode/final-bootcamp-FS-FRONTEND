import React from "react";
// Importar Link, Outlet y useLocation para navegación
import { Link, Outlet, useLocation } from "react-router-dom";
// Importar iconos
import { Package, Users, ShoppingBag, BarChart2 } from "lucide-react";

/**
 * Dashboard de Administración (AdminDashboard).
 * 
 * Es el contenedor principal para las páginas de administración.
 * Funcionalidades:
 * 1. Muestra un menú de acceso rápido a las secciones (Productos, Usuarios, Órdenes).
 * 2. Utiliza Outlet para renderizar las sub-rutas de administración.
 * 3. Muestra un resumen de actividad si se está en la ruta raíz del admin.
 */
const AdminDashboard = () => {
    const location = useLocation();
    // Determinar si estamos en la ruta raíz /admin
    const isExactAdminPath = location.pathname === "/admin";

    // Definición de las tarjetas de navegación del dashboard
    // Cada objeto representa una sección administrativa disponible
    const cards = [
        {
            title: "Productos",
            icon: Package,
            link: "/admin/products", // Ruta a la gestión de productos
            color: "bg-blue-500",
            description: "Gestionar catálogo de productos",
        },
        {
            title: "Usuarios",
            icon: Users,
            link: "/admin/users", // Ruta a la gestión de usuarios
            color: "bg-green-500",
            description: "Administrar usuarios registrados",
        },
        {
            title: "Órdenes",
            icon: ShoppingBag,
            link: "/admin/orders", // Ruta a la gestión de órdenes
            color: "bg-purple-500",
            description: "Ver y gestionar pedidos",
        },
    ];

    // Si estamos en una subruta (ej: /admin/products), mostrar solo el contenido de esa ruta (Outlet)
    if (!isExactAdminPath) {
        return <Outlet />;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BarChart2 className="mr-3 h-8 w-8 text-indigo-600" />
                Panel de Administración
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.link}
                        className="block group"
                    >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg ${card.color} bg-opacity-10 text-${card.color.split('-')[1]}-600`}>
                                    <card.icon className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                        {card.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {card.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen de Actividad</h2>
                <p className="text-gray-500">
                    Bienvenido al panel de control. Desde aquí puedes gestionar todos los aspectos de tu tienda:
                </p>
                <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
                    <li>Agregar, editar o eliminar productos del catálogo.</li>
                    <li>Ver la lista de usuarios registrados y gestionar sus permisos.</li>
                    <li>Supervisar las órdenes de compra y su estado.</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboard;
