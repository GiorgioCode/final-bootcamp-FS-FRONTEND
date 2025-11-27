import React, { useState, useEffect } from "react";
// Importar API de productos
import { productsAPI } from "../../services/api";
// Importar iconos
import { Plus, Edit, Trash2, X, Save, Package } from "lucide-react";
// Importar toast para notificaciones
import { toast } from "react-toastify";

const AdminProducts = () => {
    // Estados para productos, loading, edición y formulario
    // Estado local para almacenar la lista de productos
    const [products, setProducts] = useState([]);
    // Estado para controlar el indicador de carga
    const [loading, setLoading] = useState(true);
    // Estado para saber si estamos editando un producto existente (contendrá el objeto producto) o creando uno nuevo (null)
    const [editingProduct, setEditingProduct] = useState(null);
    // Estado para controlar la visibilidad del modal de formulario
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Estado para los campos del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: "",
        stock: "",
    });

    // Efecto para cargar los productos iniciales cuando el componente se monta
    useEffect(() => {
        loadProducts();
    }, []);

    // Función asíncrona para obtener los productos desde la API
    const loadProducts = async () => {
        try {
            setLoading(true); // Activar loading
            const data = await productsAPI.getAll(); // Llamada al backend
            setProducts(data); // Actualizar estado con los datos recibidos
        } catch (error) {
            toast.error("Error al cargar productos");
        } finally {
            setLoading(false); // Desactivar loading independientemente del resultado
        }
    };

    // Manejar el envío del formulario (tanto para crear como para editar)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir recarga de la página
        try {
            if (editingProduct) {
                // Si existe editingProduct, estamos en modo EDICIÓN
                // Llamamos a la API de actualización pasando el ID y los nuevos datos
                await productsAPI.update(editingProduct.id, formData);
                toast.success("Producto actualizado exitosamente");
            } else {
                // Si editingProduct es null, estamos en modo CREACIÓN
                // Llamamos a la API de creación con los datos del formulario
                await productsAPI.create(formData);
                toast.success("Producto creado exitosamente");
            }
            closeModal(); // Cerrar el modal y limpiar el formulario
            loadProducts(); // Recargar la lista para mostrar los cambios
        } catch (error) {
            toast.error("Error al guardar el producto");
        }
    };

    // Manejar la eliminación de un producto
    const handleDelete = async (id) => {
        // Confirmación de seguridad antes de eliminar
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await productsAPI.delete(id); // Llamada a la API de eliminación
                toast.success("Producto eliminado exitosamente");
                loadProducts(); // Recargar la lista
            } catch (error) {
                toast.error("Error al eliminar el producto");
            }
        }
    };

    // Preparar y abrir el modal para EDICIÓN
    const openEditModal = (product) => {
        setEditingProduct(product); // Establecer el producto que se va a editar
        // Rellenar el formulario con los datos actuales del producto
        setFormData({
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            imagen: product.imagen,
            stock: product.stock,
        });
        setIsModalOpen(true); // Mostrar modal
    };

    // Preparar y abrir el modal para CREACIÓN
    const openCreateModal = () => {
        setEditingProduct(null); // Asegurarse de que no hay producto seleccionado (modo creación)
        // Limpiar el formulario
        setFormData({
            nombre: "",
            descripcion: "",
            precio: "",
            imagen: "",
            stock: "",
        });
        setIsModalOpen(true); // Mostrar modal
    };

    // Cerrar el modal y resetear estados
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({ nombre: "", descripcion: "", precio: "", imagen: "", stock: "" });
    };

    if (loading) return <div className="text-center py-8">Cargando...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Package className="mr-2 h-6 w-6" />
                    Gestión de Productos
                </h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Producto
                </button>
            </div>

            {/* Tabla de productos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full object-cover" src={product.imagen} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">${product.precio.toLocaleString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{product.stock}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Creación/Edición */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                                        </h3>
                                        <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                            <input
                                                type="text"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.nombre}
                                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                            <textarea
                                                required
                                                rows={3}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.descripcion}
                                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Precio</label>
                                                <input
                                                    type="number"
                                                    required
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    value={formData.precio}
                                                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Stock</label>
                                                <input
                                                    type="number"
                                                    required
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">URL de Imagen</label>
                                            <input
                                                type="url"
                                                required
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                value={formData.imagen}
                                                onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Guardar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
