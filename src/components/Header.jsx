import React, { useState } from "react";
// Importar Link y useNavigate para navegación
import { Link, useNavigate } from "react-router-dom";
// Importar iconos de lucide-react
import { ShoppingCart, User, Menu, X, LogOut, Package } from "lucide-react";
// Importar stores
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";

const Header = () => {
    // Estado para menú móvil
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Obtener funciones y estado del store de carrito
    const { toggleCart, getCurrentCart } = useCartStore();
    // Obtener funciones y estado del store de autenticación
    const { user, logout, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    // Obtener items del carrito actual
    const cartItems = getCurrentCart();
    // Calcular cantidad total de items
    const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Manejar cierre de sesión
    const handleLogout = () => {
        logout();
        navigate("/login");
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-indigo-600">
                        GameHub
                    </Link>

                    {/* Navegación Desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            Inicio
                        </Link>
                        <Link
                            to="/products"
                            className="text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            Productos
                        </Link>

                        {/* Mostrar enlace de Admin si el usuario es administrador */}
                        {user?.isAdmin && (
                            <Link
                                to="/admin"
                                className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                            >
                                Panel Admin
                            </Link>
                        )}
                    </nav>

                    {/* Iconos Desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Botón de Carrito */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>

                        {/* Menú de Usuario */}
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/orders"
                                    className="flex items-center text-gray-600 hover:text-indigo-600"
                                    title="Mis Órdenes"
                                >
                                    <Package className="h-6 w-6" />
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <User className="h-6 w-6 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {user?.nombre}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <User className="h-6 w-6" />
                                <span>Iniciar Sesión</span>
                            </Link>
                        )}
                    </div>

                    {/* Botón Menú Móvil */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Menú Móvil */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        <Link
                            to="/"
                            className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Inicio
                        </Link>
                        <Link
                            to="/products"
                            className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Productos
                        </Link>

                        {/* Enlace Admin Móvil */}
                        {user?.isAdmin && (
                            <Link
                                to="/admin"
                                className="block px-3 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-md"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Panel Admin
                            </Link>
                        )}

                        {/* Enlace Órdenes Móvil */}
                        {isAuthenticated && (
                            <Link
                                to="/orders"
                                className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Mis Órdenes
                            </Link>
                        )}

                        {/* Botón Carrito Móvil */}
                        <button
                            onClick={() => {
                                toggleCart();
                                setIsMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md flex items-center justify-between"
                        >
                            <span>Carrito</span>
                            {cartItemsCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </button>

                        {/* Login/Logout Móvil */}
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md flex items-center space-x-2"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Cerrar Sesión ({user?.nombre})</span>
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="block px-3 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-md"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
