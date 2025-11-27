import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Punto de entrada principal de la aplicación React.
 * 
 * Este archivo se encarga de:
 * 1. Importar los estilos globales (index.css).
 * 2. Importar el componente raíz (App).
 * 3. Montar la aplicación en el elemento DOM con id 'root'.
 * 4. Envolver la aplicación en StrictMode para destacar problemas potenciales durante el desarrollo.
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
