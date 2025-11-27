tareas pendientes

-   [x] Store de autenticacion
-   [x] Store de Carrito
-   [x] Componente de Ruta Protegida
-   [x] Servicio para conexion de la API
-   [x] Componente Login
-   [x] Componente Register
-   [x] Modificar Header
-   [x] Modificar Componente Cart
-   [x] Modificar App

OBSERVACIONES ENCONTRADAS

-   Al agregar un producto, se dispara en automatico el drawer del carrito.
    -   no se puede salir del carrito apretando en el layer oscuro
    -   al abrisrse en automatico, interumpe el proceso de agregado de productos
    -   falta agregar un Toast para aumentar el feedback de agregar productos (react toastify https://www.npmjs.com/package/react-toastify)
    -   deteccion de usuario logueado al intentar comprar, correcta
    -   acciones ante usuario no logueado al agregar al carrito, incorrecta (boton de iniciar sesion inhabilitado)
    -   falta agregar ante usuario no logueado, la posibilidad de registrarse
    -   deberia eliminarse el boton de vaciar carrito, cuando el usuario no esta logueado y tiene productos seleccionados
    -   flujo de trabajo del carrito ante usuario logueado, correcto
    -   Falta implementacion de pasarela de pagos
-   Faltan filtros de productos
-   Falta agregar posibilidad de tener usuario administrador y gestionar productos desde el frontend (CRUD PRODUCTOS)
-   Los cards de los productos, no tienen un vista de detalle.
-   falta gestion de olvido de contraseña
-   falta feedback mediante email de registro
-   falta verificacion de email de usuario
-   falta capacidad de enviar mails
