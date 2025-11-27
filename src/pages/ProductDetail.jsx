import React, { useEffect, useState } from "react";
// Importar hooks de navegación
import { useParams, useNavigate } from "react-router-dom";
// Importar API de productos
import { productsAPI } from "../services/api";
// Importar store del carrito
import { useCartStore } from "../store/useCartStore";
// Importar iconos
import { ShoppingCart, ArrowLeft, Truck, Shield, Check } from "lucide-react";
// Importar toast para notificaciones
import { toast } from "react-toastify";

/**
 * Página de Detalle de Producto (ProductDetail).
 * 
 * Muestra la información completa de un producto específico.
 * Funcionalidades:
 * 1. Obtiene el ID del producto de la URL.
 * 2. Carga los datos del producto desde la API.
 * 3. Permite agregar el producto al carrito.
 * 4. Muestra información de envío y garantía.
 */
const ProductDetail = () => {
    // Obtener el ID del producto desde la URL (ej: /products/123)
    const { id } = useParams();
    // Hook para navegación programática
    const navigate = useNavigate();

    // Estado para almacenar los datos del producto
    const [product, setProduct] = useState(null);
    // Estado para controlar el indicador de carga
    const [loading, setLoading] = useState(true);
    // Estado para manejar errores de carga
    const [error, setError] = useState(null);

    // Obtener la función addItem del store global del carrito
    const addItem = useCartStore((state) => state.addItem);

    // Efecto para cargar los detalles del producto cuando cambia el ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Llamada a la API para obtener el producto por ID
                const data = await productsAPI.getById(id);
                setProduct(data); // Guardar datos en el estado
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Error al cargar el producto"); // Establecer mensaje de error
            } finally {
                setLoading(false); // Finalizar estado de carga
            }
        };

        fetchProduct();
    }, [id]); // Dependencia: id (se ejecuta si cambia el ID en la URL)

    // Manejar la acción de agregar al carrito
    const handleAddToCart = () => {
        // Usar la función del store para agregar el producto actual
        addItem(product);
        // Mostrar notificación de éxito
        toast.success(`¡${product.nombre} agregado al carrito!`);
    };

    // Renderizar estado de carga
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Renderizar estado de error
    if (error || !product) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-4">
                    {error || "Producto no encontrado"}
                </div>
                <button
                    onClick={() => navigate("/products")}
                    className="block mx-auto text-indigo-600 hover:text-indigo-500"
                >
                    Volver al catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Botón volver */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition-colors"
            >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
            </button>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Imagen del producto */}
                    <div className="p-8 bg-gray-50 flex items-center justify-center">
                        <img
                            src={product.imagen}
                            alt={product.nombre}
                            className="max-w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg"
                        />
                    </div>

                    {/* Información del producto */}
                    <div className="p-8 flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {product.nombre}
                        </h1>

                        <div className="flex items-center mb-6">
                            <span className="text-3xl font-bold text-indigo-600">
                                ${product.precio.toLocaleString()}
                            </span>
                            <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
                                <Check className="h-4 w-4 mr-1" />
                                Stock Disponible
                            </span>
                        </div>

                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {product.descripcion}
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center text-gray-600">
                                <Truck className="h-5 w-5 mr-3 text-indigo-500" />
                                <span>Envío gratis a todo el país</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Shield className="h-5 w-5 mr-3 text-indigo-500" />
                                <span>Garantía oficial de 12 meses</span>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full md:w-auto flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <ShoppingCart className="h-6 w-6 mr-2" />
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
