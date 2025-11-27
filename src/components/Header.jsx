import React, { useState } from "react";
// Importar Link y useNavigate para navegación
import { Link, useNavigate } from "react-router-dom";
// Importar iconos de lucide-react
import { ShoppingCart, User, Menu, X, LogOut, Package, Sun, Moon } from "lucide-react";
// Importar stores
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

/**
 * Componente Header (Encabezado).
 * 
 * Barra de navegación principal que aparece en la parte superior de todas las páginas.
 * Funcionalidades:
 * 1. Navegación principal (Inicio, Productos).
 * 2. Acceso al panel de administración (solo admins).
 * 3. Cambio de tema (Claro/Oscuro).
 * 4. Acceso al carrito de compras con contador de items.
 * 5. Gestión de sesión de usuario (Login/Logout/Perfil).
 * 6. Menú hamburguesa responsivo para dispositivos móviles.
 */
const Header = () => {
    // Estado para controlar la visibilidad del menú móvil
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Hooks de los stores globales
    const { toggleCart, getCurrentCart } = useCartStore();
    const { user, logout, isAuthenticated } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();

    const navigate = useNavigate();

    // Calcular items del carrito para el badge de notificación
    const cartItems = getCurrentCart();
    const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Manejar el cierre de sesión
    const handleLogout = () => {
        logout(); // Limpiar estado de auth
        navigate("/login"); // Redirigir a login
        setIsMenuOpen(false); // Cerrar menú móvil si está abierto
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        GameHub
                    </Link>

                    {/* Navegación Desktop */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            Inicio
                        </Link>
                        <Link
                            to="/products"
                            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                            Productos
                        </Link>

                        {/* Mostrar enlace de Admin si el usuario es administrador */}
                        {user?.isAdmin && (
                            <Link
                                to="/admin"
                                className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                            >
                                Panel Admin
                            </Link>
                        )}
                    </nav>

                    {/* Iconos Desktop */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Botón de Tema */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                        >
                            {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                        </button>

                        {/* Botón de Carrito */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
                                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                    title="Mis Órdenes"
                                >
                                    <Package className="h-6 w-6" />
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <User className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {user?.nombre}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
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
                <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                    <div className="px-4 pt-2 pb-4 space-y-2">
                        <Link
                            to="/"
                            className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Inicio
                        </Link>
                        <Link
                            to="/products"
                            className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Productos
                        </Link>

                        {/* Enlace Admin Móvil */}
                        {user?.isAdmin && (
                            <Link
                                to="/admin"
                                className="block px-3 py-2 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Panel Admin
                            </Link>
                        )}

                        {/* Enlace Órdenes Móvil */}
                        {isAuthenticated && (
                            <Link
                                to="/orders"
                                className="block px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Mis Órdenes
                            </Link>
                        )}

                        {/* Login/Logout Móvil */}
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md flex items-center space-x-2"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Cerrar Sesión ({user?.nombre})</span>
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="block px-3 py-2 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Iniciar Sesión
                            </Link>
                        )}

                        {/* Separador e Iconos (Tema y Carrito) */}
                        <div className="border-t dark:border-gray-700 pt-4 mt-2 flex justify-center space-x-8">
                            {/* Botón Tema Móvil (Solo Icono) */}
                            <button
                                onClick={() => {
                                    toggleTheme();
                                    setIsMenuOpen(false);
                                }}
                                className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                            >
                                {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                            </button>

                            {/* Botón Carrito Móvil (Solo Icono) */}
                            <button
                                onClick={() => {
                                    toggleCart();
                                    setIsMenuOpen(false);
                                }}
                                className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <ShoppingCart className="h-6 w-6" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
