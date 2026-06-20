# Páginas y Rutas

## Públicas

| Ruta | Página | Componentes |
|------|--------|-------------|
| `/auth` | `AuthPage` | Login, Register (tabs) |
| `/reset-password` | `ResetPassword` | ResetPassword |

## Dashboard (protegidas)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/dashboard` | `DashboardPage` | Resumen con StatsBar, gráficos, últimas integraciones |
| `/dashboard/connections` | `ConnectionsPage` | CRUD de conexiones API registradas |
| `/dashboard/integrations` | `IntegrationsPage` | Lista de integraciones con estado |
| `/dashboard/explorer` | `DataExplorerPage` | Explorador de datos unificados (UnifiedDataTable) |
| `/dashboard/profile` | `ProfilePage` | Perfil del usuario logueado |

## Admin (protegidas + rol ADMIN)

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/admin` | `AdminPage` | Panel principal con atajos a gestión |
| `/admin/users` | `UsersManagement` | CRUD de usuarios y asignación de roles |
| `/admin/integrations` | `AdminIntegrationsPage` | Vista admin de todas las integraciones |
| `/admin/monitoring` | `MonitoringPage` | Monitoreo de ejecuciones y logs |
| `/admin/settings` | `AdminSettingsPage` | Configuración general del sistema |
| `/admin/llm-configs` | `AdminLlmConfigsPage` | Configuración de proveedores LLM |

## Guardas

| Guarda | Condición | Redirección |
|--------|-----------|-------------|
| `ProtectedRoute` | `!isAuthenticated` | `/auth` |
| `AdminRoute` | `!isAdmin` | `/dashboard` |
| AuthPage | `isAuthenticated` | `/dashboard` |
