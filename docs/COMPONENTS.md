# Componentes UI

## Base (`components/ui/`)

| Componente | Props clave | Descripción |
|------------|-------------|-------------|
| `LoadingState` | `message?`, `icon?` | Spinner con mensaje opcional |
| `ErrorState` | `message`, `onRetry?` | Mensaje de error con botón reintentar |
| `EmptyState` | `title`, `description?`, `icon?`, `action?` | Estado vacío con acción opcional |
| `Modal` | `open`, `onClose`, `title?`, `icon?`, `subtitle?`, `footer?`, `size?` | Modal overlay con backdrop click |
| `PageHeader` | `title`, `description?`, `icon?` | Encabezado de página |

## Conexiones e Integraciones

| Componente | Propósito |
|------------|-----------|
| `NewConnectionModal` | Modal para crear conexión API (method, URL, auth) |
| `NewIntegrationModal` | Modal para crear integración entre 2 APIs |
| `IntegrationCard` | Card de integración con estado y badge ML |
| `SchemaMatcherModal` | Modal de matching de esquemas con vista source→target |
| `MatchReviewCard` | Card para aprobar/rechazar schema match individual |
| `EtlExecutionPanel` | Panel de ejecución ETL con barra de progreso y resultado |

## Layout

| Componente | Descripción |
|------------|-------------|
| `Layout` | Layout principal con Sidebar + Header + Outlet |
| `Sidebar` | Navegación lateral con enlaces a dashboard y admin |
| `Header` | Barra superior con NotificationBell y menú de usuario |
| `AuthLayout` | Layout para páginas de autenticación |
| `DataFlowBackground` | Fondo animado 3D (Three.js) |

## Autenticación

| Componente | Descripción |
|------------|-------------|
| `Login` | Formulario de inicio de sesión |
| `Register` | Formulario de registro (con validación de admin) |
| `ForgotPassword` | Formulario de recuperación de contraseña |
| `ResetPassword` | Formulario de cambio de contraseña |
| `ChangePasswordModal` | Modal para cambiar contraseña estando logueado |

## Administración

| Componente | Descripción |
|------------|-------------|
| `AdminPanel` | Panel de administración con tarjetas de acceso rápido |
| `UsersManagement` | Tabla de gestión de usuarios (CRUD + activación) |
| `StatsBar` | Barra de estadísticas del dashboard |
| `NotificationBell` | Campana de notificaciones con contador y menú |
| `UnifiedDataTable` | Tabla genérica de datos unificados |
