# ETL Automate — Arquitectura del Frontend

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | React 19 |
| Build | Vite 5 |
| Lenguaje | TypeScript 5.5 |
| Estilos | Tailwind CSS 3.4 |
| Ruteo | React Router 7 |
| Formularios | React Hook Form + Zod 4 |
| Animaciones | Three.js + Motion |
| Íconos | Lucide React |
| HTTP | Axios |

## Estructura de directorios

```
src/
├── assets/           # Recursos estáticos (imágenes, iconos)
├── components/       # Componentes de UI reutilizables
│   ├── ui/           # Componentes base (botones, inputs, modales)
│   └── connections/  # Componentes específicos de conexiones
├── context/          # Contextos globales (AuthContext)
├── hooks/            # Custom hooks de React
├── lib/              # Utilidades (cn)
├── pages/            # Vistas principales
├── services/         # Cliente HTTP y llamadas API
└── types/            # Interfaces y tipos TypeScript
```

## Árbol de enrutamiento

```
/auth                          → AuthPage (login/register)
/reset-password                → ResetPassword
/dashboard                     → DashboardPage (protegida)
/dashboard/connections         → ConnectionsPage
/dashboard/integrations        → IntegrationsPage
/dashboard/explorer            → DataExplorerPage
/dashboard/profile             → ProfilePage
/admin                         → AdminPage (admin)
/admin/users                   → UsersManagement
/admin/integrations            → AdminIntegrationsPage
/admin/monitoring              → MonitoringPage
/admin/settings                → AdminSettingsPage
/admin/llm-configs             → AdminLlmConfigsPage
```

## Capas y flujo de datos

```
Pages (vistas)
  │
  ├── Components (UI reutilizables)
  │     │
  │     ├── Hooks (estado + lógica)
  │     │     │
  │     │     └── Services (llamadas HTTP)
  │     │           │
  │     │           └── api.ts (Axios instancia + interceptors)
  │
  └── Context (AuthContext — estado global de autenticación)
```

## Patrones

- Todos los hooks de datos (CRUD) siguen el mismo patrón: `fetch`, `loading`, `error` + operaciones que mutan el estado local.
- API Gateway en `http://localhost:8080` — los interceptors de Axios inyectan `Authorization: Bearer <token>` automáticamente.
- El interceptor de response redirige a `/auth` en 401.

## Servicios backend referenciados

| Servicio | Puerto | Propósito |
|----------|--------|-----------|
| API Gateway | 8080 | Proxy unificado |
| api-register-ms | — | Registro de APIs |
| integration-ms | — | Gestión de integraciones |
| schema-matching-ms | — | Matching de esquemas |
| ms-save-data | — | Ejecución ETL (load) |
| user-role-service | 8083 | Roles de usuario |
