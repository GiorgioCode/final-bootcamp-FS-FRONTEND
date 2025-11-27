import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { paymentAPI } from "../services/api";
import { toast } from "react-toastify";

const Cart = () => {
    const {
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        getCurrentCart,
        clearCart,
    } = useCartStore();

    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const cartItems = getCurrentCart();

    const subtotal = cartItems.reduce(
        (acc, item) => acc + item.precio * item.quantity,
        0
    );

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            closeCart();
            navigate("/login");
            toast.info("Por favor inicia sesión para continuar con la compra");
            return;
        }

        try {
            setIsLoading(true);

            console.log("Sending items to backend:", cartItems);

            const items = cartItems.map((item) => ({
                title: item.nombre,
                unit_price: item.precio,
                quantity: item.quantity,
            }));

            const response = await paymentAPI.createPreference(items);

            console.log("Backend response:", response);

            if (response.success && response.id) {
                const preferenceId = response.id;
                const checkoutUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
                console.log("Redirecting to:", checkoutUrl);
                window.location.href = checkoutUrl;
            } else {
                throw new Error("No se recibió ID de preferencia del servidor");
            }
        } catch (error) {
            console.error("Error al procesar el pago:", error);
            toast.error(error.message || "Error al procesar el pago. Intente nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={closeCart}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md transform transition-transform duration-300 ease-in-out bg-white shadow-xl flex flex-col h-full">
                    <div className="flex items-center justify-between px-4 py-6 bg-gray-50 border-b">
                        <h2 className="text-lg font-medium text-gray-900 flex items-center">
                            <ShoppingBag className="h-5 w-5 mr-2" />
                            Carrito de Compras
                        </h2>
                        <button
                            onClick={closeCart}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                                <p className="text-gray-500 text-lg mb-4">
                                    Tu carrito está vacío
                                </p>
                                <button
                                    onClick={closeCart}
                                    className="text-indigo-600 font-medium hover:text-indigo-500"
                                >
                                    Continuar comprando
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex py-6 border-b">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={item.imagen}
                                                alt={item.nombre}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>
                                                        <Link
                                                            to={`/products/${item.id}`}
                                                            onClick={closeCart}
                                                        >
                                                            {item.nombre}
                                                        </Link>
                                                    </h3>
                                                    <p className="ml-4">
                                                        ${(item.precio * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Precio unitario: ${item.precio.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                Math.max(1, item.quantity - 1)
                                                            )
                                                        }
                                                        className="p-1 hover:bg-gray-100"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="px-2 font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="p-1 hover:bg-gray-100"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
                            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                                <p>Subtotal</p>
                                <p>${subtotal.toLocaleString()}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500 mb-6">
                                Envío e impuestos calculados al finalizar la compra.
                            </p>

                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Procesando...
                                    </span>
                                ) : isAuthenticated ? (
                                    "Proceder al Pago"
                                ) : (
                                    "Iniciar Sesión para Comprar"
                                )}
                            </button>

                            <div className="mt-4 flex justify-center text-center text-sm text-gray-500">
                                <button
                                    type="button"
                                    className="font-medium text-red-600 hover:text-red-500"
                                    onClick={() => {
                                        if (window.confirm("¿Estás seguro de vaciar el carrito?")) {
                                            clearCart();
                                        }
                                    }}
                                >
                                    Vaciar Carrito
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
