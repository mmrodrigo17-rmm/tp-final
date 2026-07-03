# 🛒 Mi Tienda — eCommerce Monumental

Aplicación web de comercio electrónico desarrollada con React, Firebase y Vite. Incluye catálogo de productos con búsqueda y paginación, carrito de compras, autenticación de usuarios y panel de administración para gestión de productos.

## 📸 Capturas de pantalla

*(Agregar capturas aquí)*

## 🚀 Tecnologías utilizadas

- **React 19** — Biblioteca principal de interfaz de usuario
- **Vite 8** — Bundler y entorno de desarrollo
- **React Router 7** — Navegación SPA con rutas protegidas
- **Firebase** — Autenticación (Firebase Auth) y base de datos (Firestore)
- **React-Bootstrap** — Componentes de UI responsivos
- **styled-components** — Estilos con CSS-in-JS
- **React Icons** — Iconografía
- **react-helmet-async** — SEO dinámico

## ✨ Funcionalidades

- Catálogo de productos con búsqueda por nombre y paginación (8 por página)
- Vista detalle de producto con indicadores de stock
- Carrito de compras con control de cantidades
- Autenticación de usuarios (registro e inicio de sesión)
- Panel de administración con CRUD completo de productos
- Diseño responsivo adaptable a dispositivos móviles
- SEO dinámico con títulos y descripciones por página

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/mmrodrigo17-rmm/tp-final.git
cd tp-final

# Instalar dependencias
npm install
```

## 🔥 Configuración de Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Authentication** con el proveedor de **Correo electrónico/Contraseña**
3. Crear una base de datos **Firestore** en modo de prueba
4. Copiar las credenciales del proyecto en `src/firebase/config.js`:

```js
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
};
```

> ⚠️ **Importante**: No subas tus credenciales reales al repositorio. Usa variables de entorno o agrega el archivo de configuración al `.gitignore`.

### Credenciales de administrador

| Campo | Valor |
|-------|-------|
| Correo | `admin@gmail.com` |
| Contraseña | `1234` |

El usuario con correo `admin@gmail.com` tiene acceso automático al panel de administración.

## 📋 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Ejecuta el linter |
| `npm run deploy` | Publica en GitHub Pages |

## 🌐 Deploy a GitHub Pages

El proyecto está configurado para deploy en GitHub Pages con subruta `/tp-final/`.

```bash
npm run deploy
```

Esto compila la aplicación y publica el contenido de `dist/` en la rama `gh-pages`.

La aplicación queda disponible en:
```
https://mmrodrigo17-rmm.github.io/tp-final/
```

## 👥 Equipo

- **Rodrigo Morel** — Frontend Dev
- **Marcelo Gallardo** — UX/UI Designer
- **Enzo Pérez** — Backend Dev

---

Proyecto desarrollado para la cursada de React — Comisión 74530 (2025)
