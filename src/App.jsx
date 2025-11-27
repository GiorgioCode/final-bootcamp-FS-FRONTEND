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

function App() {
    // Obtener usuario y función para setear carrito
    const { user } = useAuthStore();
    const setUserCart = useCartStore((state) => state.setUser);

    // Efecto para sincronizar el carrito con el usuario actual
    useEffect(() => {
        setUserCart(user ? user.id : null);
    }, [user, setUserCart]);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                {/* Componente de notificaciones */}
                <ToastContainer position="bottom-right" />

                {/* Header de la aplicación */}
                <Header />

                {/* Drawer del carrito */}
                <Cart />

                <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/products/:id" element={<ProductDetail />} />

                        {/* Rutas protegidas (requieren login) */}
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <OrderHistory />
                                </ProtectedRoute>
                            }
                        />

                        {/* Rutas de administrador */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        >
                            {/* Sub-rutas del dashboard de admin */}
                            <Route index element={<Navigate to="/admin/products" replace />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="users" element={<AdminUsers />} />
                            <Route path="orders" element={<AdminOrders />} />
                        </Route>

                        {/* Rutas de autenticación */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/verify-email" element={<EmailVerification />} />

                        {/* Rutas de resultado de pago */}
                        <Route path="/success" element={<PaymentResult status="success" />} />
                        <Route path="/failure" element={<PaymentResult status="failure" />} />
                        <Route path="/pending" element={<PaymentResult status="pending" />} />

                        {/* Ruta 404 */}
                        <Route path="*" element={<NoEncontrada />} />
                    </Routes>
                </main>

                {/* Footer de la aplicación */}
                <Footer />
            </div>
        </Router>
    );
}

export default App;
