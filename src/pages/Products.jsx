import React, { useEffect, useState } from "react";
// Importar API de productos
import { productsAPI } from "../services/api";
// Importar componente de lista de productos
import ProductList from "../components/ProductList";

/**
 * Página de Catálogo de Productos (Products).
 * 
 * Muestra el listado completo de productos disponibles.
 * Se encarga de:
 * 1. Obtener los datos de productos desde la API.
 * 2. Manejar estados de carga y error.
 * 3. Renderizar el componente ProductList con los datos obtenidos.
 */
const Products = () => {
  // Estados para productos, loading y error
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para cargar productos al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Obtener todos los productos desde la API
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error al cargar los productos. Por favor intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Renderizar estado de error
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo de Productos</h1>
        <p className="text-gray-600">Explora nuestra colección completa de tecnología</p>
      </div>

      {/* Componente de lista de productos con filtros */}
      <ProductList products={products} />
    </div>
  );
};

export default Products;
