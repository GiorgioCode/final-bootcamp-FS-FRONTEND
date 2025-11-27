import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-indigo-400">GameHub</h3>
                        <p className="text-gray-400 mb-4">
                            Tu destino definitivo para todo lo relacionado con gaming y tecnología.
                            Los mejores productos al mejor precio.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">
                                    Mi Cuenta
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center text-gray-400">
                                <MapPin className="h-5 w-5 mr-2 text-indigo-500" />
                                <span>Av. Tecnología 123, Buenos Aires</span>
                            </li>
                            <li className="flex items-center text-gray-400">
                                <Phone className="h-5 w-5 mr-2 text-indigo-500" />
                                <span>+54 11 1234-5678</span>
                            </li>
                            <li className="flex items-center text-gray-400">
                                <Mail className="h-5 w-5 mr-2 text-indigo-500" />
                                <span>contacto@gamehub.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-indigo-600 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-indigo-600 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-indigo-600 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} GameHub. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
