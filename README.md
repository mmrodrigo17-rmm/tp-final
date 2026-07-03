# 🛒 Mi Tienda — eCommerce Monumental

Aplicación web de comercio electrónico con catálogo de productos, carrito de compras, autenticación de usuarios y panel de administración completo. Construida con React 19, Firebase y Vite 8.

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
| **Catálogo de productos** | Listado paginado (8 productos por página) con imágenes, precios y categorías |
| **Búsqueda en vivo** | Filtro de productos por nombre desde la barra de navegación |
| **Detalle de producto** | Vista individual con descripción, precio, categoría, indicador de stock disponible y botón para agregar al carrito |
| **Carrito de compras** | Vista con lista de productos seleccionados, control de cantidades (sumar/restar), eliminación individual, vaciado total y cálculo automático del subtotal por ítem y total general |
| **Checkout** | Botón "Finalizar Compra" que registra la transacción en Firestore asociada al usuario autenticado. Incluye protección anti-doble-click (botón deshabilitado + spinner) y manejo de errores de red (si falla, el carrito se conserva para reintentar) |
| **Confirmación de compra** | Pantalla posterior al checkout con mensaje "¡Gracias por tu compra!" y detalle completo de los productos adquiridos (imagen, nombre, precio unitario, cantidad, subtotal y total) |
| **Autenticación** | Registro e inicio de sesión con Firebase Auth. Rutas protegidas: el carrito requiere usuario logueado |
| **SEO dinámico** | Títulos y meta descriptions por página usando react-helmet-async |

### Panel de administración

| Funcionalidad | Descripción |
|---------------|-------------|
| **Acceso restringido** | Solo el usuario `admin@gmail.com` puede acceder al Dashboard |
| **ABM de productos** | Listado completo con tabla responsive, botón "Agregar Producto", edición y eliminación con confirmación modal. Carga inicial con spinner y manejo de errores de Firestore |
| **Filtros de productos** | Filtro por categoría (select con opciones únicas obtenidas de los productos cargados) y filtro por stock mínimo |
| **Listado de transacciones** | Pestaña "Transacciones" con tabla de todas las compras realizadas: ID, email del comprador, total, estado, cantidad de ítems y fecha |
| **Filtros de transacciones** | Por estado (completada/pendiente), por rango de fechas (desde/hasta con input tipo date) y búsqueda por email |
| **Exportación CSV** | Botón "Exportar CSV" que descarga las transacciones visibles (según filtros aplicados) en formato CSV listo para abrir en Excel o Google Sheets |

---

## 🚀 Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19 | Biblioteca principal de interfaz de usuario |
| **Vite** | 8 | Bundler y entorno de desarrollo (Rolldown en producción) |
| **React Router** | 7 | Navegación SPA con rutas protegidas (ProtectedRoute, AdminRoute) |
| **Firebase Auth** | — | Autenticación de usuarios con email y contraseña |
| **Firestore** | — | Base de datos NoSQL en tiempo real (colecciones: `productos`, `transacciones`) |
| **React-Bootstrap** | — | Componentes de UI responsivos (grid, tabs, tablas, modales, formularios) |
| **styled-components** | — | Estilos con CSS-in-JS y props transientes (`$variant`, `$size`) |
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
│   │   ├── detail/
│   │   │   └── ItemDetailContainer.jsx
│   │   ├── layouts/
│   │   │   ├── Layout.jsx          ← Layout principal con Outlet y contexto de búsqueda
│   │   │   ├── Nav.jsx             ← Navbar responsive con hamburguesa, search, cart badge
│   │   │   └── Footer.jsx
│   │   ├── products/
│   │   │   └── ItemListContainer.jsx ← Catálogo con búsqueda y paginación
│   │   └── widgets/
│   │       └── ProtectedRoute.jsx  ← Ruta protegida para usuarios autenticados
│   ├── context/
│   │   ├── AuthContext.jsx         ← Contexto de autenticación Firebase
│   │   ├── CartContext.jsx         ← Contexto del carrito (estado local)
│   │   └── CartProvider.jsx
│   ├── firebase/
│   │   └── config.js              ← Configuración e inicialización de Firebase
│   ├── pages/
│   │   ├── Cart.jsx               ← Carrito con checkout y confirmación de compra
│   │   ├── Dashboard.jsx          ← Panel admin con tabs Productos + Transacciones
│   │   ├── ItemDetail.jsx
│   │   ├── ItemList.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   └── checkoutService.js     ← Lógica de creación de transacciones
│   ├── App.jsx                    ← Router principal con todas las rutas
│   └── main.jsx                   ← Entry point
├── openspec/                      ← Artefactos de especificación SDD
├── firestore.rules                ← Reglas de seguridad de Firestore
├── index.html
├── vite.config.js                 ← Configuración base: '/tp-final/'
└── package.json
```

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/mmrodrigo17-rmm/tp-final.git
cd tp-final

# Instalar dependencias
npm install
```

**Requisitos:** Node.js 18+ y npm 9+.

---

## 🔥 Configuración de Firebase

### 1. Crear proyecto en Firebase Console

Andá a [Firebase Console](https://console.firebase.google.com) y creá un proyecto nuevo (o usá uno existente).

### 2. Habilitar Authentication

1. En el menú lateral, andá a **Authentication** → **Sign-in method**
2. Habilitá el proveedor **Email/Password**
3. Guardá los cambios

### 3. Crear Firestore

1. En el menú lateral, andá a **Firestore Database**
2. Hacé click en **Create database**
3. Elegí **Start in test mode** (para desarrollo; luego aplicá las reglas de `firestore.rules`)
4. Elegí la región más cercana

### 4. Configurar credenciales con variables de entorno

Las credenciales de Firebase se manejan mediante variables de entorno con prefijo `VITE_` (Vite las expone automáticamente al cliente).

#### Desarrollo local

1. En Firebase Console, andá a **Project Settings** → **General** → **Your apps**
2. Creá una app web si no existe
3. Copiá el objeto `firebaseConfig`
4. Copiá `.env.example` como `.env` y reemplazá los valores:

```bash
cp .env.example .env
```

Queda así:

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

> El archivo `.env` está en `.gitignore` — nunca se sube al repositorio.

#### CI/CD (GitHub Actions)

El workflow en `.github/workflows/deploy.yml` lee las credenciales desde **GitHub Secrets** y las inyecta durante el build. Los secrets que hay que crear en el repositorio:

| Secret | Valor |
|--------|-------|
| `FIREBASE_API_KEY` | tu-api-key |
| `FIREBASE_AUTH_DOMAIN` | tu-proyecto.firebaseapp.com |
| `FIREBASE_PROJECT_ID` | tu-proyecto |
| `FIREBASE_STORAGE_BUCKET` | tu-proyecto.appspot.com |
| `FIREBASE_MESSAGING_SENDER_ID` | tu-sender-id |
| `FIREBASE_APP_ID` | tu-app-id |

Para configurarlos:

1. Andá a tu repositorio en GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Hacé click en **New repository secret**
3. Agregá cada uno de los 6 secrets con los valores de tu proyecto Firebase

### 5. Aplicar reglas de seguridad

En Firestore Console → **Rules**, copiá el contenido de `firestore.rules`:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Productos — solo admins escriben, todos leen
    match /productos/{producto} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@gmail.com';
    }

    // Transacciones — usuarios crean sus propias, admins leen todo
    match /transacciones/{transaccion} {
      allow read: if request.auth != null && request.auth.token.email == 'admin@gmail.com';
      allow create: if request.auth != null
                    && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && request.auth.token.email == 'admin@gmail.com';
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

> El usuario con email `admin@gmail.com` obtiene acceso automático al panel de administración. Cualquier otro usuario registrado puede navegar, buscar productos y comprar, pero no accede al Dashboard.

---

## 📥 Poblar la base de datos

Para cargar productos de prueba en Firestore desde la FakeStore API:

1. Abrí el archivo `scripts/seed-productos.html` en tu navegador
2. Hacé click en **"Ejecutar Seed"**
3. Se van a crear 20 productos con datos reales y stock aleatorio (5–54 unidades cada uno)
4. Recargá la aplicación para verlos

> Este script se ejecuta del lado del cliente usando la misma configuración de Firebase que la app. No requiere backend adicional.

---

## 🖥️ Ejecución en desarrollo

```bash
npm run dev
```

El servidor de desarrollo arranca en `http://localhost:5173/tp-final/`.

Flujo de prueba recomendado:

1. **Registrar un usuario** → andá a **Register** y creá una cuenta
2. **Explorar productos** → navegá el catálogo, usá la búsqueda, revisá el detalle de un producto
3. **Agregar al carrito** → desde el detalle o el catálogo, agregá productos
4. **Ir al carrito** → `/carrito` — ajustá cantidades, eliminá productos
5. **Finalizar compra** → hacé click en **Finalizar Compra** → verificá la pantalla de confirmación
6. **Iniciar sesión como admin** → `admin@gmail.com` / `1234`
7. **Dashboard** → `/dashboard` — explorá las pestañas Productos y Transacciones
8. **ABM productos** → agregá, editá y eliminá productos desde la pestaña Productos
9. **Filtrar** → usá los filtros de categoría y stock mínimo en productos, y los filtros de estado/fecha/email en transacciones
10. **Exportar CSV** → en la pestaña Transacciones, hacé click en **Exportar CSV**

---

## 🌐 Despliegue

El proyecto tiene dos formas de deploy a **GitHub Pages** con subruta `/tp-final/`.

### Opción 1: Deploy automático con GitHub Actions (recomendado)

Cada vez que se hace push a `main`, el workflow `.github/workflows/deploy.yml`:

1. Lee las credenciales de Firebase desde **GitHub Secrets**
2. Crea el archivo `.env` con esos valores
3. Compila la aplicación
4. Publica en la rama `gh-pages**

**Requisito:** configurar los 6 secrets en GitHub (ver sección [Configuración de Firebase](#4-configurar-credenciales-con-variables-de-entorno)).

### Opción 2: Deploy manual

```bash
npm run deploy
```

Esto ejecuta `npm run build` y publica el contenido de `dist/` en la rama `gh-pages` usando el paquete `gh-pages`.

> ⚠️ En deploy manual, si eliminaste las credenciales hardcodeadas de `src/firebase/config.js`, necesitás tener el archivo `.env` con los valores antes de ejecutar `npm run build`.

### Configuración de GitHub Pages

1. En tu repositorio de GitHub, andá a **Settings** → **Pages**
2. En **Source**, seleccioná **Deploy from a branch**
3. Elegí la rama `gh-pages` y carpeta `/ (root)`
4. Guardá

La aplicación queda disponible en:

```
https://mmrodrigo17-rmm.github.io/tp-final/
```

> ⚠️ La CDN de GitHub Pages puede tardar unos minutos en propagar el nuevo build después del deploy. Si ves una versión anterior, hace **Ctrl+Shift+R** (hard refresh) y esperá unos minutos.

---

## 📋 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo (Vite) |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Previsualiza la build de producción localmente |
| `npm run lint` | Ejecuta ESLint |
| `npm run deploy` | Publica en GitHub Pages (build + push a gh-pages) |

---

## 🛡️ Reglas de seguridad (Firestore)

Las reglas en `firestore.rules` garantizan que:

- **Cualquier persona** puede leer los productos (incluso sin autenticarse)
- **Solo el admin** (`admin@gmail.com`) puede crear, editar o eliminar productos
- **Usuarios autenticados** pueden crear transacciones (solo con su propio `userId`)
- **Solo el admin** puede leer, actualizar o eliminar transacciones
- Las transacciones creadas verifican que `request.resource.data.userId == request.auth.uid` para evitar suplantación

---

## 👥 Equipo

- **Rodrigo Morel** — Frontend Dev
- **Marcelo Gallardo** — UX/UI Designer
- **Enzo Pérez** — Backend Dev

---

Proyecto desarrollado para la cursada de React — Comisión 74530 (2025)
