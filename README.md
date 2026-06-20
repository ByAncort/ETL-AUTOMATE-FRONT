# ETL Automate — Frontend

Plataforma de integración y automatización ETL con panel de administración, gestor de conexiones API, y orquestación de pipelines de datos. UI en español, construida con React 19 + TypeScript + Tailwind CSS.

---

## Tabla de Contenidos

- [Arquitectura](#arquitectura)
- [Tech Stack](#tech-stack)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Routing](#routing)
- [Autenticación](#autenticación)
- [Componentes](#componentes)
- [Hooks y Estado](#hooks-y-estado)
- [Servicios y API](#servicios-y-api)
- [Pruebas](#pruebas)
- [Desarrollo](#desarrollo)
- [CI/CD](#cicd)
- [Docker](#docker)

---

## Arquitectura

```mermaid
graph TB
    subgraph Frontend["Frontend React 19"]
        Router["React Router DOM"]
        AuthCtx["AuthContext<br/>JWT + Roles"]
        Pages["Pages"]
        Layout["Layout<br/>Sidebar + Header + Outlet"]
        Components["Components<br/>UI + Feature"]
        Hooks["Custom Hooks<br/>useApiConnections, useIntegrations..."]
        Services["Services<br/>Axios API Layer"]
        Types["TypeScript Types"]
    end

    subgraph Backend["Backend Java Spring Boot"]
        API["REST API<br/>localhost:8080"]
    end

    Router -->|Route Guards| AuthCtx
    Router --> Pages
    Pages --> Layout
    Pages --> Components
    Pages --> Hooks
    Hooks --> Services
    Services -->|"HTTP / Axios"| API
    AuthCtx -->|"Bearer Token"| Services
    Components --> Hooks
    Types --> Pages
    Types --> Components
    Types --> Hooks
```

```mermaid
graph LR
    subgraph DataFlow["Data Flow"]
        direction LR
        User -->|"Login<br/>POST /auth/token"| API
        API -->|"JWT"| AuthCtx
        AuthCtx -->|"Token in localStorage"| Services
        Services -->|"GET /api-registry/list"| API
        Services -->|"POST /api/etl/run"| API
        Services -->|"GET /api/integrations/*"| API
        Services -->|"POST /api/schema-matches/feedback"| API
        API -->|"JSON Response"| Hooks
        Hooks -->|"State {data, loading, error}"| Components
    end
```

---

## Tech Stack

| Categoría | Tecnología |
|-----------|-----------|
| **Framework** | React 19.2.6 |
| **Build** | Vite 5.4 |
| **Lenguaje** | TypeScript 5.5 (strict) |
| **Estilos** | Tailwind CSS 3.4 + `clsx` + `tailwind-merge` (`cn()`) |
| **Routing** | React Router DOM 7.15 |
| **Formularios** | React Hook Form 7.75 + Zod 4.4 |
| **HTTP** | Axios 1.16 |
| **Animación** | Motion 12 (Framer Motion), Three.js 0.184, Cobe 2.0 (globo 3D) |
| **Iconos** | Lucide React 1.14 |
| **Testing** | Jest 30 + ts-jest + Testing Library |
| **Linting** | ESLint 9 + typescript-eslint + react-hooks + react-refresh |

```mermaid
graph TD
    subgraph Testing["Testing Stack"]
        Jest["Jest 30<br/>Test Runner"]
        tsJest["ts-jest<br/>TypeScript Transformer"]
        RTL["@testing-library/react<br/>Component Rendering"]
        JSDOM["jest-environment-jsdom<br/>Browser Simulation"]
        JestDOM["@testing-library/jest-dom<br/>Custom Matchers"]
        UserEvent["@testing-library/user-event<br/>User Interaction"]
    end

    Jest --> tsJest
    Jest --> JSDOM
    Jest --> RTL
    RTL --> JestDOM
    RTL --> UserEvent
```

---

## Estructura del Proyecto

```
src/
├── __mocks__/              # Mock manual de axios (TypeScript)
├── assets/                 # Assets estáticos (texturas, imágenes)
├── components/             # Componentes React
│   ├── connections/        #   Gestor de conexiones API
│   ├── ui/                 #   Primitivas UI reutilizables
│   └── __tests__/          #   Tests de componentes
├── context/                # React Context (AuthContext)
├── hooks/                  # Custom hooks con estado async
│   └── __tests__/
├── lib/                    # Utilidades (apiError, cn)
│   └── __tests__/
├── pages/                  # Componentes de página (rutas)
├── services/               # Capa HTTP (Axios + servicios)
│   └── __tests__/
├── test/                   # Setup de tests
└── types/                  # Interfaces y tipos compartidos
```

---

## Routing

```mermaid
flowchart LR
    App["App.tsx<br/>Routes"] --> AuthRoute["/auth"]
    App --> ResetRoute["/reset-password"]
    App --> Protected["ProtectedRoute"]
    App --> CatchAll["*"]

    Protected --> Layout["Layout<br/>Sidebar + Header + Outlet"]
    Layout --> Dashboard["/dashboard"]
    Layout --> Connections["/dashboard/connections"]
    Layout --> Integrations["/dashboard/integrations"]
    Layout --> Explorer["/dashboard/explorer"]
    Layout --> Profile["/dashboard/profile"]
    Layout --> AdminRoute["AdminRoute"]

    AdminRoute --> Admin["/admin"]
    AdminRoute --> Users["/admin/users"]
    AdminRoute --> AdminIntegrations["/admin/integrations"]
    AdminRoute --> Monitoring["/admin/monitoring"]
    AdminRoute --> Settings["/admin/settings"]
    AdminRoute --> LlmConfigs["/admin/llm-configs"]

    AuthRoute -->|"Autenticado"| Dashboard
    AuthRoute -->|"No autenticado"| AuthPage["AuthPage<br/>Login|Register|ForgotPassword"]
```

| Ruta | Acceso | Componente |
|------|--------|-----------|
| `/auth` | Público | `AuthPage` (Login / Register / ForgotPassword) |
| `/reset-password?token=` | Público | `ResetPassword` |
| `/dashboard` | Protegido | `DashboardPage` |
| `/dashboard/connections` | Protegido | `ConnectionsPage` |
| `/dashboard/integrations` | Protegido | `IntegrationsPage` |
| `/dashboard/explorer` | Protegido | `DataExplorerPage` |
| `/dashboard/profile` | Protegido | `ProfilePage` |
| `/admin` | Admin | `AdminPage` |
| `/admin/users` | Admin | `UsersManagement` |
| `/admin/integrations` | Admin | `AdminIntegrationsPage` |
| `/admin/monitoring` | Admin | `MonitoringPage` |
| `/admin/settings` | Admin | `AdminSettingsPage` |
| `/admin/llm-configs` | Admin | `AdminLlmConfigsPage` |

---

## Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant L as Login Component
    participant AC as AuthContext
    participant LS as localStorage
    participant API as Backend /api

    U->>L: Ingresa credentials
    L->>API: POST /api/v1/auth/token {username, password}
    API-->>L: { accessToken: "jwt..." }
    L->>AC: login(token)
    AC->>LS: setItem("token", jwt)
    AC->>AC: decodeToken(jwt) → extract sub, roles
    AC->>API: GET /api/users/username/{username}
    API-->>AC: { id, roles, ... }
    AC->>AC: set isAuthenticated, isAdmin, userData

    Note over AC,API: Subsequent requests
    API->>API: 401 Unauthorized
    API-->>AC: Error 401
    AC->>AC: ¿Ruta pública (/auth, /reset-password)?
    alt Ruta pública
        AC->>AC: No redirige
    else Ruta protegida
        AC->>LS: removeItem("token")
        AC->>U: Redirect /auth
    end
```

- **JWT** se almacena en `localStorage` clave `token`
- **Interceptor** de Axios inyecta `Authorization: Bearer <token>` en cada request
- **Response interceptor** captura 401 y redirige a `/auth` (excepto en rutas públicas)
- **Roles** extraídos del payload JWT (`sub`, `roles`)
- **Admin view toggle** — usuarios admin pueden alternar vista admin/user

---

## Componentes

```mermaid
graph TD
    subgraph UI["UI Primitives (src/components/ui/)"]
        Modal["Modal<br/>Backdrop + Icon + Footer + Variants"]
        LoadingState["LoadingState<br/>Spinner + Message"]
        ErrorState["ErrorState<br/>Error + Retry Button"]
        EmptyState["EmptyState<br/>Icon + Title + Action"]
        PageHeader["PageHeader<br/>Icon + Title + Rainbow Divider"]
        GlowCard["GlowCard (spotlight-card)<br/>Hover Glow Effect"]
        GridPattern["GridPattern<br/>SVG Background"]
        CobeGlobe["CobeGlobe<br/>3D Interactive Globe"]
    end

    subgraph Feature["Feature Components (src/components/)"]
        Layout["Layout<br/>Sidebar + Header + DataFlowBackground"]
        Sidebar["Sidebar<br/>Navigation + Pipeline Theme"]
        Header["Header<br/>Search + Notifications + User Menu"]
        AuthLayout["AuthLayout<br/>Split Screen + Globe"]
        Login["Login<br/>Zod Validation + Password Toggle"]
        Register["Register<br/>Multi-field + Auto-clear"]
        ForgotPassword["ForgotPassword<br/>Email Reset Request"]
        ResetPassword["ResetPassword<br/>Token + New Password"]
        ChangePasswordModal["ChangePasswordModal"]
        AdminPanel["AdminPanel<br/>Stats + Users + Logs"]
        StatsBar["StatsBar<br/>4-Stat Grid"]
        IntegrationCard["IntegrationCard<br/>Status + Context Menu"]
        UnifiedDataTable["UnifiedDataTable<br/>Records + Confidence"]
        EtlExecutionPanel["EtlExecutionPanel<br/>Progress + Phases + Results"]
        SchemaMatcherModal["SchemaMatcherModal<br/>Matching + Execution"]
        MatchReviewCard["MatchReviewCard<br/>Accept/Reject + Confidence"]
        NotificationBell["NotificationBell<br/>Unread Badge + Dropdown"]
        DataFlowBackground["DataFlowBackground<br/>Canvas Particles"]
        UsersManagement["UsersManagement<br/>Full CRUD"]
        NewConnectionModal["NewConnectionModal"]
        NewIntegrationModal["NewIntegrationModal"]
    end

    subgraph Connection["Connection Components (src/components/connections/)"]
        ConnectionCard["ConnectionCard<br/>Method Badge + Auth Info"]
        CreateConnectionModal["CreateConnectionModal<br/>Full Form + Auth Config"]
        TestResultDialog["TestResultDialog<br/>Status + Response JSON"]
    end
```

---

## Hooks y Estado

Cada hook expone el mismo patrón: fetch en mount + estado `{data, loading, error}` + operaciones CRUD.

| Hook | Endpoints | Operaciones |
|------|-----------|------------|
| `useApiConnections` | `GET /api-registry/list`, `POST`, `DELETE`, `POST /{id}/test` | `create`, `delete`, `test`, `refetch` |
| `useIntegrations` | `GET /api/integrations/connections`, `POST`, `POST /{id}`, `DELETE /{id}` | `create`, `update`, `delete`, `refetch` |
| `useEtlExecution` | `POST /api/etl/run/{integrationId}` | `execute`, `reset` |
| `useLlmConfigs` | `GET /api/llm-configs`, `POST`, `PUT /{id}`, `DELETE /{id}`, `PATCH /{id}/default` | `create`, `update`, `delete`, `setDefault`, `refetch` |
| `useUnifiedRecords` | `GET /api/schema-matches` | `refetch` |
| `useUsers` | `GET /api/users`, `DELETE /api/users/{id}` | `deleteUser`, `refetch` |

```mermaid
sequenceDiagram
    participant C as Component
    participant H as Custom Hook
    participant S as Service (Axios)
    participant API as Backend

    Note over C: Mount
    C->>H: useXxx()
    H->>H: setLoading(true)
    H->>S: api.get()
    S->>API: HTTP Request
    API-->>S: Response
    S-->>H: Response Data
    H->>H: setData(response.data)
    H->>H: setLoading(false)
    H-->>C: { data, loading: false, error: null }

    Note over C: CRUD Action
    C->>H: createConnection(payload)
    H->>S: api.post(url, payload)
    S->>API: HTTP POST
    API-->>S: Created Resource
    H->>H: setData(prev => [newData, ...prev])
    H-->>C: { success: true, data }
```

---

## Servicios y API

### Endpoints

| Método | Endpoint | Servicio | Propósito |
|--------|----------|----------|-----------|
| POST | `/api/v1/auth/token` | Auth | Login |
| POST | `/api/users/register` | Auth | Registro |
| GET | `/api/users/username/{username}` | Auth | Perfil por username |
| GET | `/api/users` | Admin | Listar usuarios |
| PUT | `/api/users/{id}` | Admin | Actualizar usuario |
| DELETE | `/api/users/{id}` | Admin | Eliminar usuario |
| POST | `/api/users/{id}/verify-email` | Admin | Verificar email |
| POST | `/api/users/{id}/activate` | Admin | Activar usuario |
| POST | `/api/users/{id}/deactivate` | Admin | Desactivar usuario |
| POST | `/api/users/forgot-password` | Auth | Solicitar reset |
| POST | `/api/users/reset-password` | Auth | Ejecutar reset |
| GET | `/api/users/roles` | Admin | Listar roles |
| POST | `/api/user-roles/assign` | Admin | Asignar rol |
| DELETE | `/api/user-roles/remove` | Admin | Remover rol |
| GET | `/api-registry/list` | Connections | Listar conexiones |
| POST | `/api-registry` | Connections | Crear conexión |
| DELETE | `/api-registry/{id}` | Connections | Eliminar conexión |
| POST | `/api-registry/{id}/test` | Connections | Testear conexión |
| GET | `/api/integrations/connections` | Integrations | Listar integraciones |
| POST | `/api/integrations/connections` | Integrations | Crear integración |
| POST | `/api/integrations/connections/{id}` | Integrations | Actualizar integración |
| DELETE | `/api/integrations/connections/{id}` | Integrations | Eliminar integración |
| GET | `/api/schema-matches` | Matching | Listar matches |
| GET | `/api/schema-matches/integration/{id}` | Matching | Matches por integración |
| POST | `/api/schema-matches/feedback` | Matching | Feedback de match |
| POST | `/api/integrations/connections/{id}/run-matching` | Matching | Ejecutar matching |
| POST | `/api/etl/run` | ETL | Ejecutar ETL |
| POST | `/api/etl/run/{id}` | ETL | Ejecutar por integración |
| GET | `/api/llm-configs` | LLM | Listar configs |
| POST | `/api/llm-configs` | LLM | Crear config |
| PUT | `/api/llm-configs/{id}` | LLM | Actualizar config |
| DELETE | `/api/llm-configs/{id}` | LLM | Eliminar config |
| PATCH | `/api/llm-configs/{id}/default` | LLM | Set default |
| GET | `/api/integrations/logs` | Logs | Logs del sistema |

### Mapeo de Errores (`mapApiError`)

```mermaid
flowchart LR
    Error["Axios Error"] --> NoResponse["¿err.response<br/>=== undefined?"]
    NoResponse -->|"Sí"| Timeout["¿code ==<br/>ECONNABORTED?"]
    Timeout -->|"Sí"| TO["La solicitud tardó<br/>demasiado"]
    Timeout -->|"No"| Conn["No se pudo conectar<br/>con el servidor"]
    NoResponse -->|"No"| Status["response.status"]
    Status -->|"≥ 500"| S5xx["Error del servidor"]
    Status -->|"404"| S404["Recurso no<br/>encontrado"]
    Status -->|"401/403"| S401["No tienes autorización"]
    Status -->|"400"| S400["Mensaje del backend<br/>o fallback"]
```

---

## Pruebas

```mermaid
flowchart LR
    subgraph Unit["Unit Tests"]
        Services["Services<br/>5 test files"]
        Lib["Lib<br/>2 test files"]
        Hooks["Hooks<br/>6 test files"]
    end

    subgraph Component["Component Tests"]
        UI["UI Primitives<br/>5 test files"]
        Feature["Features<br/>9 test files"]
    end

    subgraph Integration["Integration Tests"]
        Auth["AuthContext<br/>1 test file"]
    end

    TestRunner["Jest 30 + ts-jest<br/>jsdom"] --> Unit
    TestRunner --> Component
    TestRunner --> Integration

    Unit -->|"jest.mock('axios')<br/>mockResolvedValue"| Assertions["Assertions<br/>toBe, toBeNull, toHaveLength"]
    Component -->|"render + screen<br/>+ userEvent"| Assertions
    Integration -->|"renderHook + waitFor<br/>+ act"| IntegrationAssertions["Assertions<br/>toBeInTheDocument,<br/>toHaveBeenCalledTimes"]
```

### Ejecución

```bash
npm test              # Jest (all tests)
npm run test:watch    # Watch mode
npm run test:coverage # Con cobertura
npm run test:verbose  # Verboso
```

### Tests por categoría

| Categoría | Archivos | Estrategia |
|-----------|----------|------------|
| **Services** | `api.test.ts`, `etlService.test.ts`, `logService.test.ts`, `notificationService.test.ts`, `schemaMatchService.test.ts` | Mock de Axios, aserciones en endpoints y headers |
| **Hooks** | `useApiConnections.test.ts`, `useIntegrations.test.ts`, `useUnifiedRecords.test.ts`, `useUsers.test.ts`, `useLlmConfigs.test.ts`, `useEtlExecution.test.ts` | `renderHook` + `waitFor` + `act`, mock de api |
| **Components** | `Header.test.tsx`, `IntegrationCard.test.tsx`, `NotificationBell.test.tsx`, `StatsBar.test.tsx`, `ResetPassword.test.tsx`, `ChangePasswordModal.test.tsx`, `ForgotPassword.test.tsx`, `Register.test.tsx`, Modal, LoadingState, ErrorState, PageHeader, EmptyState | `render` + `screen` + `userEvent`, mock de dependencias |
| **Auth Context** | `AuthContext.test.tsx` | JWT mock, localStorage, render con provider |

---

## Desarrollo

### Requisitos

- Node.js 18+
- npm

### Instalación

```bash
npm install
```

### Comandos

```bash
npm run dev          # Vite dev server (hot reload)
npm run build        # Build producción
npm run preview      # Preview build
npm run typecheck    # TypeScript strict check
npm run lint         # ESLint
npm test             # Jest tests
```

### Variables de entorno

El `baseURL` de Axios está hardcodeado a `http://localhost:8080`. El `docker-compose.yml` define `VITE_API_URL` pero actualmente no se referencia en el código.

---

## CI/CD

```yaml
# .github/workflows/qa-tests.yml — se ejecuta en push a qa
#   - npm run typecheck
#   - npm run test:coverage
#   - npm run lint
```

---

## Docker

```bash
docker compose up    # Inicia frontend en puerto 5173
```

Basado en `node:18-alpine`, expone en `0.0.0.0:5173` con hot reload.

---

## Estructura de Layout

```mermaid
graph TD
    subgraph LayoutShell["Layout.tsx"]
        Sidebar["Sidebar<br/>Colapsable + Pipeline Theme"]
        HeaderBar["Header<br/>Title + Search + Notifications + User Menu"]
        Content["Outlet<br/>Page Content"]
        DataFlow["DataFlowBackground<br/>Canvas Particle Animation"]
    end

    Sidebar -->|"Nav Item Click"| Content
    HeaderBar -->|"Nueva Integración"| Modal["NewIntegrationModal"]
    HeaderBar -->|"Notificaciones"| NotificationBell["NotificationBell Dropdown"]
    HeaderBar -->|"User Menu"| Dropdown["Perfil / Admin Toggle / Cerrar Sesión"]
```

---

## Types Principales

```typescript
// src/types/index.ts
type IntegrationStatus = 'active' | 'pending' | 'error' | 'inactive';

interface Integration {
  id: string;
  name: string;
  source: string;
  status: IntegrationStatus;
  lastRun: string;
  recordsProcessed: number;
  mlBadge?: string;
}

interface SchemaMatch {
  id: number;
  integrationId: number;
  sourceField: string;
  targetField: string;
  confidence: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

interface UnifiedRecord {
  unifiedId: string;
  entityName: string;
  originA: string;
  originB: string;
  confidence: number;
  highlight?: boolean;
}
```
