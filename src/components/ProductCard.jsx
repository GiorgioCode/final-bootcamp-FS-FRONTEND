import React from "react";
// Importar Link para navegación
import { Link } from "react-router-dom";
// Importar store del carrito
import { useCartStore } from "../store/useCartStore";
// Importar icono de carrito
import { ShoppingCart, Heart, Star } from "lucide-react";
// Importar toast para notificaciones
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
    // Obtener función para agregar al carrito
    const addItem = useCartStore((state) => state.addItem);

    // Manejar agregar al carrito
    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevenir navegación al detalle
        addItem(product); // Usar addItem (nombre correcto del store)
        toast.success(`¡${product.nombre} agregado al carrito!`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 flex flex-col h-full group">
            <Link to={`/products/${product.id}`} className="relative h-48 overflow-hidden block">
                <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-sm">
                    <Heart className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors cursor-pointer" />
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-md">
                        {product.categoria || "Tecnología"}
                    </span>
                    <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">4.8</span>
                    </div>
                </div>

                <Link to={`/products/${product.id}`} className="block">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                        {product.nombre}
                    </h3>
                </Link>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                    {product.descripcion}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${product.precio?.toLocaleString()}
                        </span>
                    </div>
                    <button
                        onClick={handleAddToCart} // Usar handleAddToCart para mantener la lógica de toast y preventDefault
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center group-hover:bg-indigo-700"
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
