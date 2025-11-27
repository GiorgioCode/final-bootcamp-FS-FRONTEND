import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import axios from "axios";
import { ordersAPI } from "../services/api";
import { toast } from "react-toastify";

/**
 * Página de Resultado de Pago (PaymentResult).
 * 
 * Maneja el retorno desde la pasarela de pagos (MercadoPago).
 * Funcionalidades:
 * 1. Recibe parámetros de la URL (status, payment_id).
 * 2. Si el pago fue exitoso, crea la orden en el backend.
 * 3. Limpia el carrito tras una compra exitosa.
 * 4. Muestra mensajes de éxito, fallo o pendiente.
 */
const PaymentResult = ({ status }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // Obtener funciones del store
    const { clearCart, getCurrentCart } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(true);

    // Obtener parámetros de MercadoPago
    const paymentId = searchParams.get("payment_id");
    const collectionStatus = searchParams.get("collection_status");
    const merchantOrderId = searchParams.get("merchant_order_id");

    useEffect(() => {
        const processPayment = async () => {
            // Solo procesar si el estado es 'success' y tenemos un ID de pago
            if (status === "success" && paymentId) {
                try {
                    const cartItems = getCurrentCart();

                    // Si hay items en el carrito, creamos la orden
                    if (cartItems.length > 0) {
                        const total = cartItems.reduce(
                            (acc, item) => acc + item.precio * item.quantity,
                            0
                        );

                        const orderData = {
                            productos: cartItems.map((item) => ({
                                id: item.id,
                                nombre: item.nombre,
                                precio: item.precio,
                                cantidad: item.quantity,
                            })),
                            total: total,
                        };

                        // Crear la orden en el backend
                        await ordersAPI.create(orderData);

                        // Limpiar el carrito después de crear la orden
                        clearCart();
                        toast.success("¡Pago exitoso! Tu orden ha sido procesada y enviada a tu email.");
                    } else {
                        // Si el carrito ya está vacío (ej: recarga de página), solo mostramos éxito
                        toast.success("¡Pago exitoso!");
                    }
                } catch (error) {
                    console.error("Error procesando el resultado del pago:", error);
                    toast.error("Hubo un error al registrar tu orden, pero tu pago fue procesado. Contáctanos.");
                }
            } else if (status === "failure") {
                toast.error("El pago ha fallado. Por favor intenta nuevamente.");
            } else if (status === "pending") {
                toast.info("El pago está pendiente de confirmación.");
                clearCart();
            }
            setIsProcessing(false);
        };

        processPayment();
    }, [status, paymentId, clearCart, getCurrentCart]);

    if (isProcessing) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-600">Procesando resultado del pago...</p>
            </div>
        );
    }

    const renderContent = () => {
        switch (status) {
            case "success":
                return (
                    <>
                        <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Pago Exitoso!</h1>
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            Gracias por tu compra. Hemos recibido tu pago correctamente.
                            Te hemos enviado un correo con los detalles de tu orden.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-6 mb-8 w-full max-w-md">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">ID de Pago:</span>
                                <span className="font-medium">{paymentId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Estado:</span>
                                <span className="text-green-600 font-medium">Aprobado</span>
                            </div>
                        </div>
                    </>
                );
            case "failure":
                return (
                    <>
                        <XCircle className="h-20 w-20 text-red-500 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pago Fallido</h1>
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            Lo sentimos, hubo un problema al procesar tu pago.
                            No se ha realizado ningún cargo a tu tarjeta.
                        </p>
                    </>
                );
            case "pending":
                return (
                    <>
                        <Clock className="h-20 w-20 text-yellow-500 mb-6" />
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pago Pendiente</h1>
                        <p className="text-gray-600 text-center max-w-md mb-8">
                            Tu pago está siendo procesado. Te avisaremos cuando se confirme.
                        </p>
                    </>
                );
            default:
                return (
                    <p className="text-red-500">Estado desconocido</p>
                );
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {renderContent()}
            <div className="flex gap-4">
                <Link
                    to="/products"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Seguir Comprando
                </Link>
                {status === "success" && (
                    <Link
                        to="/orders"
                        className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Ver Mis Órdenes <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;
