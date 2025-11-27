import React from "react";
// Importar Link para navegación
import { Link } from "react-router-dom";
// Importar store del carrito
import { useCartStore } from "../store/useCartStore";
// Importar icono de carrito
import { ShoppingCart } from "lucide-react";
// Importar toast para notificaciones
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
    // Obtener función para agregar al carrito
    const addItem = useCartStore((state) => state.addItem);

    // Manejar agregar al carrito
    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevenir navegación al detalle
        addItem(product);
        toast.success(`¡${product.nombre} agregado al carrito!`);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
            {/* Imagen del producto con enlace al detalle */}
            <Link to={`/products/${product.id}`} className="block relative pt-[100%]">
                <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
            </Link>

            {/* Información del producto */}
            <div className="p-4 flex flex-col flex-grow">
                <Link to={`/products/${product.id}`} className="block mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
                        {product.nombre}
                    </h3>
                </Link>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {product.descripcion}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-xl font-bold text-gray-900">
                        ${product.precio.toLocaleString()}
                    </span>

                    {/* Botón de agregar al carrito */}
                    <button
                        onClick={handleAddToCart}
                        className="flex items-center justify-center p-2 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        title="Agregar al carrito"
                    >
                        <ShoppingCart className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
