# GameHub - Frontend Technical Documentation

Este documento detalla la arquitectura, patrones de diseño y decisiones técnicas implementadas en el frontend de GameHub.

## 🏗️ Arquitectura del Proyecto

El proyecto está construido sobre **Vite** para un entorno de desarrollo rápido y optimizado. La estructura sigue un patrón modular basado en características y servicios.

### Stack Tecnológico
-   **Framework:** React 18 (Hooks pattern)
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS (Utility-first) + PostCSS
-   **State Management:** Zustand
-   **Routing:** React Router DOM v6
-   **HTTP Client:** Fetch API (Custom Wrapper)

## 🧠 Gestión de Estado (Zustand)

Se eligió **Zustand** por su simplicidad y rendimiento (sin Context API boilerplate). La aplicación maneja tres stores globales:

### 1. `useCartStore`
Maneja la lógica del carrito de compras.
-   **Persistencia:** Utiliza `persist` middleware para guardar el carrito en `localStorage`.
-   **Lógica:**
    -   `addItem`: Verifica si el producto ya existe. Si existe, incrementa cantidad; si no, lo agrega.
    -   `updateQuantity`: Controla que la cantidad no sea menor a 1.
    -   `setUser`: Asocia un carrito local a un ID de usuario cuando este se loguea.

### 2. `useAuthStore`
Maneja la sesión del usuario.
-   **Persistencia:** `sessionStorage` (para mayor seguridad que localStorage en tokens).
-   **Acciones:** `login` (guarda token y user), `logout` (limpia storage y estado), `updateUser`.
-   **Seguridad:** El estado `isAuthenticated` se deriva de la existencia del token y usuario.

### 3. `useThemeStore`
Controla el tema Dark/Light.
-   **Estrategia:** Manipulación directa del DOM (`document.documentElement.classList`).
-   **Persistencia:** `localStorage` ('theme-storage').
-   **Sincronización:** Al cargar la app, lee el storage y aplica la clase `dark` al tag `<html>` si corresponde.

## 🔐 Autenticación y Seguridad

### Flujo JWT
1.  **Login:** El backend devuelve un JWT.
2.  **Almacenamiento:** Se guarda en `sessionStorage` vía `useAuthStore`.
3.  **Intercepción:** El servicio `api.js` inyecta automáticamente el header `Authorization: Bearer <token>` en cada petición que requiera permisos (`getHeaders(true)`).
4.  **Expiración:** Si el backend retorna `401 Unauthorized`, el interceptor `handleResponse` captura el error, limpia la sesión y redirige a `/login`.

### Protección de Rutas
Se implementaron componentes HOC (Higher-Order Components) para proteger rutas:
-   **`<ProtectedRoute>`:** Verifica `isAuthenticated`. Si es false, redirige a login.
-   **`<AdminRoute>`:** Verifica `isAuthenticated` Y `user.isAdmin`. Si falla, redirige a home.

## 📡 Capa de Servicios (`api.js`)

No se usan llamadas `fetch` directas en los componentes. Todo el acceso a datos está centralizado en `src/services/api.js`.

-   **Patrón Singleton/Module:** Exporta objetos `authAPI`, `productsAPI`, `usersAPI`, etc.
-   **Configuración Dinámica:** Usa `import.meta.env.VITE_API_URL` para cambiar entre localhost y producción automáticamente.
-   **Manejo de Errores Centralizado:** La función `handleResponse` procesa todas las respuestas, parsea JSON y lanza errores con mensajes legibles para el usuario (que luego se muestran con `react-toastify`).

## 💳 Integración de Pagos (MercadoPago)

El flujo de pago es **Redirect-based**:
1.  **Frontend:** `Cart.jsx` recopila items y llama a `paymentAPI.createPreference`.
2.  **Backend:** Genera una preferencia en MP y devuelve un `init_point` (URL).
3.  **Redirección:** El frontend redirige al usuario a esa URL externa (`window.location.href`).
4.  **Retorno:** MP redirige al usuario a `/success`, `/failure` o `/pending`.
5.  **Componente `PaymentResult`:** Captura los query params de la URL de retorno, valida el estado y muestra el mensaje correspondiente (y vacía el carrito si es exitoso).

## 🎨 Sistema de Diseño (Tailwind + Dark Mode)

-   **Configuración:** `tailwind.config.js` con `darkMode: 'class'`.
-   **Implementación:**
    -   Clases condicionales: `bg-white dark:bg-gray-800`.
    -   Transiciones suaves: `transition-colors duration-200` en contenedores principales.
    -   **Componentes:** Diseño atómico. `ProductCard`, `Header`, `Footer` son componentes puros que reciben props y se adaptan al tema.

## 📂 Estructura de Directorios Explicada

-   `/src/components`: Componentes de UI (dumb components) y lógica de vista.
-   `/src/pages`: Vistas completas (smart components) que conectan stores con componentes.
-   `/src/store`: Definición de estados globales (Zustand).
-   `/src/services`: Lógica de negocio y comunicación HTTP.
-   `/src/static`: Assets optimizados.

## 🚀 Scripts

-   `npm run dev`: Inicia servidor de desarrollo Vite (HMR activo).
-   `npm run build`: Genera bundle de producción en `/dist`.
-   `npm run preview`: Sirve el build de producción localmente.

## 🌳 Árbol del Proyecto

```
src/
├── App.jsx                 # Componente principal y configuración de rutas
├── main.jsx                # Punto de entrada de la aplicación
├── index.css               # Estilos globales y directivas Tailwind
├── services/
│   └── api.js              # Servicio centralizado de comunicación con API
├── store/
│   ├── useAuthStore.js     # Estado de autenticación (Zustand)
│   ├── useCartStore.js     # Estado del carrito de compras (Zustand)
│   └── useThemeStore.js    # Estado del tema oscuro/claro (Zustand)
├── components/
│   ├── Header.jsx          # Barra de navegación con toggle de tema
│   ├── Footer.jsx          # Pie de página
│   ├── Cart.jsx            # Drawer del carrito de compras
│   ├── ProductCard.jsx     # Tarjeta de visualización de producto
│   ├── ProductList.jsx     # Grilla de productos
│   ├── Login.jsx           # Formulario de inicio de sesión
│   ├── Register.jsx        # Formulario de registro
│   ├── ProtectedRoute.jsx  # HOC para rutas privadas
│   └── AdminRoute.jsx      # HOC para rutas de administrador
└── pages/
    ├── Home.jsx            # Página de inicio (Hero + Destacados)
    ├── Products.jsx        # Catálogo completo de productos
    ├── ProductDetail.jsx   # Vista detallada de producto
    ├── OrderHistory.jsx    # Historial de compras del usuario
    ├── PaymentResult.jsx   # Páginas de retorno de MercadoPago
    ├── EmailVerification.jsx # Verificación de cuenta
    ├── ForgotPassword.jsx  # Solicitud de recuperación de contraseña
    ├── ResetPassword.jsx   # Establecimiento de nueva contraseña
    ├── NoEncontrada.jsx    # Página 404
    └── admin/
        ├── AdminDashboard.jsx # Panel principal de administración
        ├── AdminProducts.jsx  # Gestión de productos (CRUD)
        ├── AdminUsers.jsx     # Gestión de usuarios
        └── AdminOrders.jsx    # Gestión de todas las órdenes
```
