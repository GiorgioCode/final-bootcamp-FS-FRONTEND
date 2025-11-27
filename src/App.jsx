import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
// Importar stores y componentes
import { useAuthStore } from "./store/useAuthStore";
import { useCartStore } from "./store/useCartStore";
import Header from "./components/Header";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import OrderHistory from "./pages/OrderHistory";
import Login from "./components/Login";
import Register from "./components/Register";
import NoEncontrada from "./pages/NoEncontrada";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PaymentResult from "./pages/PaymentResult";
import EmailVerification from "./pages/EmailVerification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Componente principal de la aplicación (App).
 * 
 * Este componente actúa como el contenedor principal y define la estructura general de la aplicación.
 * Sus responsabilidades incluyen:
 * 1. Configurar el enrutamiento (Router) para la navegación entre páginas.
 * 2. Gestionar el estado global inicial (sincronización del carrito con el usuario).
 * 3. Renderizar componentes comunes como Header, Footer y el Drawer del Carrito.
 * 4. Definir todas las rutas de la aplicación, incluyendo rutas públicas, protegidas y de administrador.
 * 5. Configurar el sistema de notificaciones (ToastContainer).
 */
function App() {
    // Obtener usuario autenticado desde el store de autenticación
    const { user } = useAuthStore();
    // Obtener función para establecer el usuario en el store del carrito
    const setUserCart = useCartStore((state) => state.setUser);

    // Efecto para sincronizar el carrito con el usuario actual
    // Cuando el usuario cambia (login/logout), actualizamos el id del usuario en el store del carrito
    // para cargar o limpiar el carrito correspondiente.
    useEffect(() => {
        setUserCart(user ? user.id : null);
    }, [user, setUserCart]);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
                {/* Componente de notificaciones global */}
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />

                {/* Header de la aplicación: Barra de navegación superior */}
                <Header />

                {/* Drawer del carrito: Componente deslizante para ver el carrito */}
                <Cart />

                {/* Contenido principal: Aquí se renderizan las páginas según la ruta */}
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        {/* --- Rutas Públicas --- */}
                        {/* Página de inicio */}
                        <Route path="/" element={<Home />} />
                        {/* Catálogo de productos */}
                        <Route path="/products" element={<Products />} />
                        {/* Detalle de un producto específico */}
                        <Route path="/products/:id" element={<ProductDetail />} />

                        {/* --- Rutas Protegidas (Requieren autenticación) --- */}
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <OrderHistory />
                                </ProtectedRoute>
                            }
                        />

                        {/* --- Rutas de Administrador (Requieren rol de admin) --- */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        >
                            {/* Sub-rutas del dashboard de admin */}
                            {/* Redirección por defecto a productos */}
                            <Route index element={<Navigate to="/admin/products" replace />} />
                            {/* Gestión de productos */}
                            <Route path="products" element={<AdminProducts />} />
                            {/* Gestión de usuarios */}
                            <Route path="users" element={<AdminUsers />} />
                            {/* Gestión de órdenes */}
                            <Route path="orders" element={<AdminOrders />} />
                        </Route>

                        {/* --- Rutas de Autenticación --- */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/verify-email" element={<EmailVerification />} />

                        {/* --- Rutas de Resultado de Pago (MercadoPago) --- */}
                        <Route path="/success" element={<PaymentResult status="success" />} />
                        <Route path="/failure" element={<PaymentResult status="failure" />} />
                        <Route path="/pending" element={<PaymentResult status="pending" />} />

                        {/* --- Ruta 404: Página no encontrada --- */}
                        <Route path="*" element={<NoEncontrada />} />
                    </Routes>
                </main>

                {/* Footer de la aplicación: Pie de página */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;
