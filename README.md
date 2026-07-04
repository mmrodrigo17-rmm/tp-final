# 🛒 Mi Tienda — eCommerce Monumental

Aplicación web de comercio electrónico con catálogo de productos, carrusel en la home, carrito de compras, autenticación de usuarios, panel de administración completo y página de contacto. Construida con React 19, Firebase y Vite 8.

---

## 📑 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologías](#-tecnologías)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración de Firebase](#-configuración-de-firebase)
- [Credenciales de acceso](#-credenciales-de-acceso)
- [Poblar la base de datos](#-poblar-la-base-de-datos)
- [Ejecución en desarrollo](#-ejecución-en-desarrollo)
- [Despliegue](#-despliegue)
- [Scripts disponibles](#-scripts-disponibles)
- [Reglas de seguridad (Firestore)](#-reglas-de-seguridad-firestore)
- [Equipo](#-equipo)

---

## ✨ Funcionalidades

### Portal de compras

| Funcionalidad | Descripción |
|---------------|-------------|
| **Carrusel en la home** | Slider con 4 productos aleatorios destacados, imágenes con gradiente superpuesto y navegación por flechas/indicadores. Responsive (400px desktop / 250px mobile) |
| **Catálogo de productos** | Listado paginado (8 productos por página) con imágenes, precios y categorías. Grilla responsive con auto-fit |
| **Búsqueda en vivo** | Filtro de productos por nombre desde la barra de navegación, con reseteo de paginación automático |
| **Detalle de producto** | Vista individual con descripción, precio, categoría, indicador de stock disponible (con alerta de bajo stock si es ≤ 5 unidades) y botón para agregar al carrito |
| **Carrito de compras** | Vista con lista de productos seleccionados, control de cantidades (sumar/restar), eliminación individual, vaciado total y cálculo automático del subtotal por ítem y total general. **Visible sin estar logueado** |
| **Checkout** | Botón "Finalizar Compra" que registra la transacción en Firestore. Si el usuario no está autenticado, redirige al login. Incluye protección anti-doble-click (botón deshabilitado + spinner), manejo de errores de red y confirmación de compra |
| **Página de Contacto** | Formulario con validación inline (nombre, email con formato, mensaje). Alert de éxito al enviar. Sin backend — feedback visual |
| **Autenticación** | Registro e inicio de sesión con Firebase Auth. Rol de administrador determinado por variable de entorno |
| **SEO dinámico** | Títulos y meta descriptions por página usando react-helmet-async |

### Panel de administración

| Funcionalidad | Descripción |
|---------------|-------------|
| **Acceso restringido** | Solo el email configurado en `VITE_ADMIN_EMAIL` (variable de entorno) puede acceder al Dashboard. Si no está configurada, nadie es admin |
| **ABM de productos** | Listado completo con tabla responsive (imagen, título, precio, stock, categoría, acciones). Botones "Agregar", "Editar" y "Eliminar" con confirmación modal. Carga inicial con spinner |
| **Filtros de productos** | Filtro por categoría (select con opciones únicas obtenidas de los productos cargados) y filtro por stock mínimo. Mensaje específico si los filtros no matchean ningún producto |
| **Listado de transacciones** | Pestaña "Transacciones" con tabla de todas las compras realizadas: ID, email del comprador, total, estado, cantidad de ítems y fecha |
| **Filtros de transacciones** | Por estado (completada/pendiente), por rango de fechas (input date desde/hasta) y búsqueda por email |
| **Exportación CSV** | Botón "Exportar CSV" que descarga las transacciones visibles (según filtros aplicados) en formato CSV |

---

## 🚀 Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19 | Biblioteca principal de interfaz de usuario |
| **Vite** | 8 | Bundler y entorno de desarrollo |
| **React Router** | 7 | Navegación SPA con rutas anidadas (Layout + Outlet) |
| **Firebase Auth** | — | Autenticación de usuarios con email y contraseña |
| **Firestore** | — | Base de datos NoSQL (colecciones: `productos`, `transacciones`) |
| **React-Bootstrap** | 5 | Componentes de UI responsivos (grid, tabs, tablas, modales, formularios, carrusel) |
| **styled-components** | 6 | Estilos con CSS-in-JS y props transientes |
| **React Icons** | — | Iconografía (Font Awesome 6) |
| **react-helmet-async** | — | SEO dinámico (títulos y meta tags por página) |
| **GitHub Pages** | — | Hosting del build de producción |

---

## 📁 Estructura del proyecto

```
tp-final/
├── public/
│   └── favicon.svg
├── scripts/
│   └── seed-productos.html        ← Script para poblar Firestore con productos de FakeStore API
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── ProductForm.jsx     ← Formulario crear/editar producto
│   │   │   ├── ProductFilters.jsx  ← Filtros de categoría y stock mínimo
│   │   │   └── TransactionTable.jsx ← Tabla de transacciones con filtros y exportación CSV
│   │   ├── auth/
│   │   │   ├── ProtectedRoute.jsx  ← Guard para rutas que requieren autenticación
│   │   │   └── AdminRoute.jsx      ← Guard para rutas que requieren rol admin
│   │   ├── detail/
│   │   │   └── ItemDetailContainer.jsx ← Vista detalle de producto con indicador de stock
│   │   ├── layouts/
│   │   │   ├── Layout.jsx          ← Layout principal con header/nav/outlet/footer
│   │   │   ├── Nav.jsx             ← Navbar responsive con buscador, badge del carrito y auth
│   │   │   └── Footer.jsx          ← Footer con datos del equipo
│   │   └── products/
│   │       ├── Item.jsx            ← Card individual de producto
│   │       └── ItemListContainer.jsx ← Catálogo con búsqueda, filtro y paginación
│   ├── context/
│   │   ├── AuthContext.jsx         ← Contexto de autenticación Firebase
│   │   └── CartContext.jsx         ← Contexto del carrito (estado local)
│   ├── firebase/
│   │   └── config.js              ← Configuración e inicialización de Firebase (solo env vars)
│   ├── pages/
│   │   ├── Cart.jsx               ← Carrito con checkout, control de cantidades y confirmación
│   │   ├── Contacto.jsx           ← Formulario de contacto con validación inline
│   │   ├── Dashboard.jsx          ← Panel admin con tabs Productos + Transacciones
│   │   ├── Home.jsx               ← Home con carrusel de productos aleatorios + catálogo
│   │   ├── Login.jsx              ← Inicio de sesión
│   │   └── Register.jsx           ← Registro de usuario
│   ├── services/
│   │   └── checkoutService.js     ← Lógica de creación de transacciones en Firestore
│   ├── utils/
│   │   └── firebaseErrors.js      ← Mapeo de errores Firebase a mensajes en español
│   ├── App.jsx                    ← Router principal con todas las rutas
│   ├── index.css                  ← Estilos globales y variables CSS
│   └── main.jsx                   ← Entry point
├── openspec/                       ← Artefactos de especificación SDD
├── .env.example                    ← Template de variables de entorno
├── .github/workflows/deploy.yml    ← CI/CD con GitHub Actions
├── firestore.rules                 ← Reglas de seguridad de Firestore
├── index.html
├── vite.config.js                  ← Configuración base: '/tp-final/'
└── package.json
```

---

## 📦 Instalación

```bash
git clone https://github.com/mmrodrigo17-rmm/tp-final.git
cd tp-final
npm install
```

**Requisitos:** Node.js 18+ y npm 9+.

---

## 🔥 Configuración de Firebase

### 1. Crear proyecto en Firebase Console

Andá a [Firebase Console](https://console.firebase.google.com) y creá un proyecto nuevo.

### 2. Habilitar Authentication

1. **Authentication** → **Sign-in method**
2. Habilitá **Email/Password**
3. Guardá los cambios

### 3. Crear Firestore

1. **Firestore Database** → **Create database**
2. Elegí **Start in test mode** (luego aplicá las reglas de `firestore.rules`)
3. Elegí la región más cercana

### 4. Configurar credenciales con variables de entorno

Las credenciales de Firebase se manejan **exclusivamente** mediante variables de entorno con prefijo `VITE_`. Sin estas variables, la app muestra un error en consola y no se inicializa.

#### Desarrollo local

```bash
cp .env.example .env
```

Editá el `.env` con tus credenciales:

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
VITE_ADMIN_EMAIL=admin@tudominio.com
```

> `VITE_ADMIN_EMAIL` define qué email tiene acceso al panel de administración. Si no se configura, **nadie** es admin.

#### CI/CD (GitHub Actions)

El workflow en `.github/workflows/deploy.yml` lee las credenciales desde **GitHub Secrets**. Los secrets a crear en **Settings → Secrets and variables → Actions**:

| Secret | Valor |
|--------|-------|
| `FIREBASE_API_KEY` | tu-api-key |
| `FIREBASE_AUTH_DOMAIN` | tu-proyecto.firebaseapp.com |
| `FIREBASE_PROJECT_ID` | tu-proyecto |
| `FIREBASE_STORAGE_BUCKET` | tu-proyecto.appspot.com |
| `FIREBASE_MESSAGING_SENDER_ID` | tu-sender-id |
| `FIREBASE_APP_ID` | tu-app-id |
| `VITE_ADMIN_EMAIL` | admin@tudominio.com |

### 5. Aplicar reglas de seguridad

En Firestore Console → **Rules**, copiá el contenido de `firestore.rules`:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{producto} {
      allow read: if true;
      allow write: if request.auth != null
                    && request.auth.token.email == 'admin@gmail.com';
    }

    match /transacciones/{transaccion} {
      allow read: if request.auth != null
                   && request.auth.token.email == 'admin@gmail.com';
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null
                             && request.auth.token.email == 'admin@gmail.com';
    }
  }
}
```

---

## 👤 Credenciales de acceso

| Rol | Email | Contraseña |
|-----|-------|------------|
| **Administrador** | `admin@gmail.com` | `1234` |
| **Usuario común** | (cualquier email) | (la que elijas al registrarte) |

> El admin se determina por `VITE_ADMIN_EMAIL` en el `.env`. En el `.env.example` y en este ejemplo de documentación se usa `admin@gmail.com`.

---

## 📥 Poblar la base de datos

Para cargar productos de prueba en Firestore desde la FakeStore API:

1. Abrí `scripts/seed-productos.html` en tu navegador
2. Hacé click en **"Ejecutar Seed"**
3. Se crean 20 productos con datos reales y stock aleatorio (5–54 unidades)
4. Recargá la aplicación

> El script se ejecuta del lado del cliente usando la misma configuración de Firebase que la app.

---

## 🖥️ Ejecución en desarrollo

```bash
npm run dev
```

El servidor arranca en `http://localhost:5173/tp-final/`.

Flujo de prueba recomendado:

1. **Registrar un usuario** → **Register**
2. **Explorar productos** → navegá el catálogo, usá la búsqueda, revisá el detalle
3. **Ver carrusel** → en la home se muestran 4 productos aleatorios destacados
4. **Agregar al carrito** → desde el detalle, agregá productos
5. **Ir al carrito** → `/carrito` — ajustá cantidades, eliminá productos
6. **Ir a contacto** → `/contacto` — probá el formulario con validación
7. **Finalizar compra** → **Finalizar Compra** → verificá la confirmación
8. **Iniciar sesión como admin** → `admin@gmail.com` / `1234`
9. **Dashboard** → `/dashboard` — explorá Productos y Transacciones
10. **ABM productos** → agregá, editá y eliminá productos
11. **Filtrar** → categoría y stock mínimo en productos; estado/fecha/email en transacciones
12. **Exportar CSV** → en Transacciones, **Exportar CSV**

---

## 🌐 Despliegue

El proyecto deploya a **GitHub Pages** con subruta `/tp-final/`.

### Opción 1: GitHub Actions (recomendado)

Cada push a `main` ejecuta el workflow `.github/workflows/deploy.yml` que:
1. Lee las credenciales desde **GitHub Secrets**
2. Crea el archivo `.env` con esos valores
3. Compila la aplicación
4. Publica en la rama `gh-pages`

### Opción 2: Manual

```bash
npm run deploy
```

> ⚠️ En deploy manual, necesitás tener el `.env` con los valores antes de `npm run build`.

### Configuración de GitHub Pages

1. **Settings** → **Pages**
2. **Source**: **Deploy from a branch**
3. Rama `gh-pages`, carpeta `/ (root)`
4. Guardá

La app queda disponible en:

```
https://mmrodrigo17-rmm.github.io/tp-final/
```

> Puede tardar unos minutos en propagar. Ctrl+Shift+R si ves una versión anterior.

---

## 📋 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Previsualiza la build localmente |
| `npm run lint` | Ejecuta ESLint |
| `npm run deploy` | Publica en GitHub Pages |

---

## 🛡️ Reglas de seguridad (Firestore)

- **Cualquier persona** puede leer productos (incluso sin autenticarse)
- **Solo el admin** puede crear, editar o eliminar productos
- **Usuarios autenticados** pueden crear transacciones (solo con su propio `userId`)
- **Solo el admin** puede leer, actualizar o eliminar transacciones
- Las transacciones verifican que `request.resource.data.userId == request.auth.uid`

---

## 👥 Equipo

- **Rodrigo Morel** — Frontend Dev
- **Marcelo Gallardo** — UX/UI Designer
- **Enzo Pérez** — Backend Dev

---

Proyecto desarrollado para la cursada de React — Comisión 74530 (2025)
