import React, { useState, useEffect } from "react";
// Importar componente de tarjeta de producto
import ProductCard from "./ProductCard";
// Importar iconos para filtros
import { Search, SlidersHorizontal } from "lucide-react";

const ProductList = ({ products }) => {
    // Estados para filtrado y ordenamiento
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [priceRange, setPriceRange] = useState({ min: "", max: "" });
    const [showFilters, setShowFilters] = useState(false);

    // Efecto para aplicar filtros cuando cambian los criterios o los productos
    useEffect(() => {
        let result = [...products];

        // Filtrar por término de búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (product) =>
                    product.nombre.toLowerCase().includes(term) ||
                    product.descripcion.toLowerCase().includes(term)
            );
        }

        // Filtrar por rango de precios
        if (priceRange.min) {
            result = result.filter((product) => product.precio >= Number(priceRange.min));
        }
        if (priceRange.max) {
            result = result.filter((product) => product.precio <= Number(priceRange.max));
        }

        // Ordenar resultados
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.precio - b.precio);
                break;
            case "price-desc":
                result.sort((a, b) => b.precio - a.precio);
                break;
            case "name-asc":
                result.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case "name-desc":
                result.sort((a, b) => b.nombre.localeCompare(a.nombre));
                break;
            default:
                break;
        }

        setFilteredProducts(result);
    }, [products, searchTerm, sortBy, priceRange]);

    return (
        <div className="space-y-6">
            {/* Barra de herramientas (Búsqueda y Filtros) */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Buscador */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Selector de Ordenamiento */}
                        <select
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="default">Ordenar por...</option>
                            <option value="price-asc">Precio: Menor a Mayor</option>
                            <option value="price-desc">Precio: Mayor a Menor</option>
                            <option value="name-asc">Nombre: A-Z</option>
                            <option value="name-desc">Nombre: Z-A</option>
                        </select>

                        {/* Botón para mostrar/ocultar filtros avanzados */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-md border ${showFilters
                                    ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
                                }`}
                            title="Filtros"
                        >
                            <SlidersHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Filtros Avanzados (Rango de Precios) */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio Mínimo
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={priceRange.min}
                                onChange={(e) =>
                                    setPriceRange({ ...priceRange, min: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Precio Máximo
                            </label>
                            <input
                                type="number"
                                placeholder="Sin límite"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={priceRange.max}
                                onChange={(e) =>
                                    setPriceRange({ ...priceRange, max: e.target.value })
                                }
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Grid de Productos */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                    <p className="text-gray-500 text-lg">
                        No se encontraron productos que coincidan con tu búsqueda.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm("");
                            setPriceRange({ min: "", max: "" });
                            setSortBy("default");
                        }}
                        className="mt-4 text-indigo-600 font-medium hover:text-indigo-500"
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;
