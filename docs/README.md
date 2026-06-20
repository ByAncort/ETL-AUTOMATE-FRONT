# ETL Automate - Frontend

Frontend web application para la plataforma **ETL Automate**, diseñada para gestionar integraciones entre sistemas, configurar APIs, y supervisar mapeos de esquemas de datos apoyados por modelos de Machine Learning (LLM).

## Características Principales

- **Gestión de Autenticación**: Login, Registro (con validación de admin), Cambio y Recuperación de contraseña.
- **Panel de Administración**: Gestión de usuarios (CRUD y activación), configuración y testing de endpoints API (NetSuite, Oracle, etc.).
- **Integraciones y Mapeo**: Visualización de integraciones de datos y uso de una interfaz para aprobar o corregir equivalencias (schema matching) generadas por ML.
- **Diseño Moderno e Interactivo**: Interfaz enriquecida con animaciones 3D (Three.js) y diseño responsive con Tailwind CSS.

## Stack Tecnológico

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes e Íconos**: [Lucide React](https://lucide.dev/)
- **Formularios y Validación**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animaciones y 3D**: [Three.js](https://threejs.org/) + [Motion](https://motion.dev/)

## Estructura del Proyecto

```text
src/
├── assets/         # Imágenes, iconos y recursos estáticos
├── components/     # Componentes de UI reutilizables (Login, modales, tablas)
│   ├── ui/         # Componentes base (Botones, Inputs, LoadingStates, GlobeCanvas)
│   └── connections/# Componentes específicos de conexiones e integraciones
├── context/        # Contextos globales de React (ej. AuthContext)
├── hooks/          # Custom hooks de React
├── pages/          # Vistas principales (Dashboard, AuthPage, AdminSettingsPage)
├── services/       # Cliente HTTP (Axios) para comunicación con el backend (API Gateway)
├── types/          # Definiciones de tipos e interfaces de TypeScript
└── App.tsx         # Configuración principal de rutas (React Router)
```

## Requisitos Previos

- **Node.js**: v18 o superior.
- **NPM** o **Yarn**.

## Instalación y Ejecución Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Compilar para producción:
   ```bash
   npm run build
   ```

## Conexión con el Backend

El frontend se comunica con el backend a través del **API Gateway** (por defecto en `http://localhost:8080`). La configuración base de la API se encuentra en `src/services/api.ts`.
Asegúrate de tener levantado el ecosistema de microservicios de `ETL-BACKEND` mediante Docker o manualmente para el correcto funcionamiento de la plataforma.

## Documentación

| Documento | Descripción |
|-----------|-------------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Arquitectura, stack, enrutamiento y flujo de datos |
| [`API_SERVICES.md`](API_SERVICES.md) | Servicios HTTP y clientes API |
| [`HOOKS.md`](HOOKS.md) | Custom hooks de React |
| [`COMPONENTS.md`](COMPONENTS.md) | Componentes UI reutilizables |
| [`PAGES.md`](PAGES.md) | Páginas y rutas del frontend |
| [`AUTH.md`](AUTH.md) | Flujo de autenticación y AuthContext |
| [`DESIGN.md`](DESIGN.md) | Tokens de diseño (colores, tipografía, componentes) |
| [`TESTING_REPORT.md`](TESTING_REPORT.md) | Reporte de cobertura de tests |
| [`SAVE_DATA_ETL_LOGIC.md`](SAVE_DATA_ETL_LOGIC.md) | Lógica de ejecución ETL (load) |
| [`MATCH_FEEDBACK_LOGIC.md`](MATCH_FEEDBACK_LOGIC.md) | Feedback de schema matching |
| [`role-controller.md`](role-controller.md) | API de roles |
| [`user-role-controller.md`](user-role-controller.md) | API de asignación de roles |
