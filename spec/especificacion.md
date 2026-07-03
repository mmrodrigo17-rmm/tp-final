 Requerimientos del Proyecto Final – React JS

Pedidos excluyentes y guia principal.

Estructura clara y ordenada del proyecto,
Estilos y diseño responsivo. Menú hamburguesa. 
(Se puede utilizar CSS puro, CSS Modules, Tailwind CSS, Bootstrap u otro framework/librería de estilos).,
Carrito de compra funcional (CarritoContext).,
Autenticación: registro, login y autorización. Si es administrador debe mostrar el Dashboard; si es usuario común no debe mostrarlo (AuthContext).,
CRUD completo en Firebase: mostrar, agregar, editar y eliminar productos.,
Al menos 2 rutas públicas (Ej.: Inicio, Productos) y 1 ruta protegida para administrador (Ej.: Dashboard, con el listadoi de productos comprados, con filtros, estadisticas, etc).,
Detalle del producto: título, precio, descripción, imagen, stock y categoría.,
Agregar al carrito. Los productos no deben duplicarse; deben incrementar/decrementar cantidad y permitir eliminación individual.,
Sección de opiniones del producto (opcional).,
Barra de búsqueda y paginación.,
Deploy realizado en GitHub Pages.

Notas:
Las credenciales para el administrador son:
Usuario admin: admin@gmail.com 
Clave admin: 1234




---------

pedidos adicionales:

Requerimiento #1: gestión del carrito y autenticación de usuarios
Objetivo: Implementar un carrito de compras funcional y restringir el acceso a secciones privadas mediante autenticación de usuarios.
 Carrito de Compras con Context API
Implementar un CarritoContext que gestione los productos agregados.
Permitir agregar, eliminar y vaciar el carrito.
Mantener el estado global con Context API.
 Autenticación de Usuarios
Crear un AuthContext para manejar el estado de autenticación (usuario logueado/no logueado).
Implementar un formulario de login y registro que se comunique con Firebase Authentication.
Proteger rutas como el panel de gestión o el perfil, permitiendo el acceso solo a usuarios autenticados.


Requerimiento #2: CRUD de productos con Firebase
Objetivo: Permitir la administración completa del catálogo de productos mediante operaciones de creación, lectura, actualización y eliminación.
 Formulario para agregar productos
Un formulario controlado para agregar nuevos productos, con validaciones (nombre obligatorio, precio > 0, etc.).
Funcionalidad para editar y eliminar productos existentes.
Implementar un modal de confirmación antes de eliminar un producto para mejorar la UX.

Manejo de estados y errores
Mostrar indicadores de carga (spinners) mientras se obtienen los datos de la API.
Gestionar y mostrar mensajes de error al usuario si la comunicación con la API falla.

Requerimiento #3: optimización de diseño y responsividad

Objetivo: Mejorar la apariencia y la accesibilidad del sitio utilizando herramientas modernas de diseño y estilización.

 Diseño Responsivo
Utilizar el sistema de grillas de React-Bootstrap para asegurar que la aplicación sea completamente adaptable a móviles, tablets y escritorios.

Emplear styled-components para crear componentes estilizados y modulares, manteniendo un código CSS limpio y organizado.
 Interactividad y feedback visual
Agregar íconos de React Icons en botones y elementos interactivos para mejorar la claridad visual.

 SEO y Accesibilidad:
Utilizar React Helmet para gestionar dinámicamente el <title> y las etiquetas <meta> de cada página, mejorando el posicionamiento en buscadores.

Requerimiento #4: funcionalidades de búsqueda y paginación

Objetivo: Mejorar la usabilidad y navegación del catálogo de productos.
 Barra de Búsqueda
Implementar una barra de búsqueda que filtre productos en tiempo real a medida que el usuario escribe.
 Paginador de Productos
Si el catálogo de productos es extenso, implementar un paginador para dividir los resultados en varias páginas, optimizando los tiempos de carga.

Requerimiento #5: preparación para el despliegue
Objetivo: Ajustar los últimos detalles para que la aplicación esté lista para ser publicada en un servidor.
 Pruebas de compatibilidad
Verificar el correcto funcionamiento en los principales navegadores.
Revisar y optimizar el código para eliminar cualquier elemento innecesario o redundante.
 Documentación básica
Incluir un archivo README.md detallado en el repositorio de GitHub, explicando cómo instalar y ejecutar el proyecto en un entorno local.
