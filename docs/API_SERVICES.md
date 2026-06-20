# API Services

## `services/api.ts` — Axios instance

Instancia central de Axios apuntando a `http://localhost:8080`.

**Request interceptor:** inyecta `Authorization: Bearer <token>` desde localStorage.

**Response interceptor:** captura 401 y redirige a `/auth` (excepto en `/auth` y `/reset-password`).

## `services/etlService.ts`

| Función | Método | Endpoint |
|---------|--------|----------|
| `runEtl(data)` | POST | `/api/etl/run` |
| `runEtlById(integrationId)` | POST | `/api/etl/run/{id}` |

Payload/response tipados como `EtlRequest` / `EtlResponse`.

## `services/logService.ts`

| Función | Método | Endpoint |
|---------|--------|----------|
| `fetchLogs()` | GET | `/api/integrations/logs` |

Retorna `LogEntry[]`.

## `services/notificationService.ts`

Sistema de notificaciones client-side (pub/sub, sin API).

- `addNotification(type, title, message)` — agrega notificación
- `markAsRead(id)` / `markAllAsRead()` — marcar leídas
- `clearAll()` — limpiar todas
- `getNotifications()` — obtener estado actual
- `subscribe(listener)` — suscribirse a cambios (retorna unsubscribe)

Tipos: `'integration' | 'connection' | 'system' | 'success' | 'error'`

## `services/schemaMatchService.ts`

| Función | Método | Endpoint |
|---------|--------|----------|
| `submitFeedback(data)` | POST | `/api/schema-matches/feedback` |
| `fetchSchemaMatches(integrationId)` | GET | `/api/schema-matches/integration/{id}` |
| `runMatching(integrationId)` | POST | `/api/integrations/connections/{id}/run-matching` |
