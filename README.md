# To-Do List Frontend (Vue 3)

Este es el repositorio frontend de la aplicación To-Do List. Consiste en una SPA (Single Page Application) moderna, reactiva y optimizada para la gestión de tareas, categorías, etiquetas y usuarios.

## Arquitectura y Tecnologías

- **Framework**: Vue 3 (Composition API & `<script setup>`)
- **Lenguaje**: TypeScript
- **Bundler**: Vite (para compilación súper rápida y HMR)
- **Estado Global**: Pinia (gestión de autenticación y variables globales)
- **Routing**: Vue Router (con Lazy Loading para optimizar el peso inicial de la app)
- **Peticiones HTTP**: Axios con interceptores y headers de autorización
- **Estilos**: Vanilla CSS puro con variables y componentes reutilizables (sin frameworks externos como Tailwind, para máximo control)

## Estructura Principal

- `src/views/`: Pantallas principales de la app (Dashboard, Tareas, Calendario, Gestión de Usuarios, Configuración/Perfil, Login).
- `src/components/`: Componentes modulares. Dividido lógicamente en subcarpetas (`tasks`, `users`, `categories`, `shared`) para mayor mantenibilidad.
- `src/services/`: Capa de integración que encapsula todas las llamadas a la API REST (Backend). Incluye manejo de filtros y paginación del lado del servidor.
- `src/stores/`: Lógica de Pinia para almacenar el JWT (`authHeader`), el nombre de usuario y los roles.

## Ejecución Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. Arranca el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. El proyecto estará disponible en `http://localhost:5173`. Asegúrate de tener el backend corriendo en el puerto `8080` (configurado mediante variables de entorno).

## Compilación para Producción

Para compilar el proyecto de cara a un despliegue estático (por ejemplo, en Nginx o Vercel):

```bash
npm run build
```

Esto generará la carpeta `dist/` con todos los assets minimizados.
