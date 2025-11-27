import React, { useEffect, useState } from "react";
// Importar Link para navegación
import { Link } from "react-router-dom";
// Importar API de productos
import { productsAPI } from "../services/api";
// Importar componente de tarjeta de producto
import ProductCard from "../components/ProductCard";
// Importar iconos
import { ArrowRight, Star, Truck, Shield, Clock } from "lucide-react";

const Home = () => {
    // Estado para productos destacados y loading
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Efecto para cargar productos al montar el componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Obtener todos los productos
                const data = await productsAPI.getAll();
                // Seleccionar los primeros 4 como destacados
                setFeaturedProducts(data.slice(0, 4));
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="relative bg-indigo-600 text-white rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-transparent opacity-50"></div>
                <div className="relative z-10 px-8 py-16 md:py-24 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Descubre la Tecnología del Futuro
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-indigo-100">
                        Encuentra los mejores dispositivos y accesorios con ofertas exclusivas. Calidad garantizada y envío rápido.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center bg-white text-indigo-600 font-bold py-3 px-8 rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
                    >
                        Ver Catálogo
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                        <Truck className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Envío Gratis</h3>
                        <p className="text-sm text-gray-500">En compras mayores a $50.000</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-50 rounded-full text-green-600">
                        <Shield className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Garantía Segura</h3>
                        <p className="text-sm text-gray-500">12 meses de garantía oficial</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-purple-50 rounded-full text-purple-600">
                        <Clock className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Soporte 24/7</h3>
                        <p className="text-sm text-gray-500">Atención al cliente todo el día</p>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section>
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Productos Destacados</h2>
                        <p className="text-gray-600">Nuestra selección de los más vendidos</p>
                    </div>
                    <Link
                        to="/products"
                        className="hidden md:flex items-center text-indigo-600 font-medium hover:text-indigo-700"
                    >
                        Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>

                {loading ? (
                    // Skeleton loading
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                                <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center md:hidden">
                    <Link
                        to="/products"
                        className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700"
                    >
                        Ver todos los productos <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-gray-900 text-white rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Suscríbete a nuestro Newsletter</h2>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    Recibe las últimas novedades, ofertas exclusivas y consejos tecnológicos directamente en tu bandeja de entrada.
                </p>
                <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        className="px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                    >
                        Suscribirse
                    </button>
                </form>
            </section>
        </div>
    );
};

export default Home;
