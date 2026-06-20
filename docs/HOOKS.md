# Custom Hooks

## `useApiConnections`

CRUD + test de conexiones API registradas.

| Retorno | Tipo |
|---------|------|
| `connections` | `ApiConnection[]` |
| `loading` | `boolean` |
| `error` | `string \| null` |
| `refetch` | `() => Promise<void>` |
| `deleteConnection(id)` | `Promise<{ success, error? }>` |
| `createConnection(payload)` | `Promise<{ success, data?, error? }>` |
| `testConnection(connection)` | `Promise<{ success, status, data?, error? }>` |

Endpoint base: `GET /api-registry/list`, `POST /api-registry`, `DELETE /api-registry/{id}`, `POST /api-registry/{id}/test`.

## `useEtlExecution`

Máquina de estados para ejecución ETL.

| Retorno | Tipo |
|---------|------|
| `phase` | `'idle' \| 'extracting' \| 'transforming' \| 'loading' \| 'done' \| 'error'` |
| `result` | `EtlResponse \| null` |
| `error` | `string \| null` |
| `progress` | `number` (0–100) |
| `execute(integrationId)` | `Promise<void>` |
| `reset()` | `() => void` |

## `useIntegrations`

CRUD de integraciones.

| Retorno | Tipo |
|---------|------|
| `integrations` | `IntegrationResponse[]` |
| `loading` | `boolean` |
| `error` | `string \| null` |
| `refetch` | `() => Promise<void>` |
| `createIntegration(payload)` | `Promise<{ success, data?, error? }>` |
| `updateIntegration(id, payload)` | `Promise<{ success, data?, error? }>` |
| `deleteIntegration(id)` | `Promise<{ success, error? }>` |

Endpoint base: `GET /api/integrations/connections`, `POST`, `DELETE`.

## `useLlmConfigs`

CRUD + setDefault de configuraciones LLM.

| Retorno | Tipo |
|---------|------|
| `configs` | `LlmConfigResponse[]` |
| `loading` | `boolean` |
| `error` | `string \| null` |
| `refetch` | `() => Promise<void>` |
| `createConfig(payload)` | `Promise<{ success, data?, error? }>` |
| `updateConfig(id, payload)` | `Promise<{ success, data?, error? }>` |
| `deleteConfig(id)` | `Promise<{ success, error? }>` |
| `setDefault(id)` | `Promise<{ success, data?, error? }>` |

Endpoint base: `GET /api/llm-configs`, `POST`, `PUT /{id}`, `DELETE /{id}`, `PATCH /{id}/default`.

## `useUnifiedRecords`

Obtiene schema matches y los transforma al formato `UnifiedRecord`.

| Retorno | Tipo |
|---------|------|
| `records` | `UnifiedRecord[]` |
| `loading` | `boolean` |
| `error` | `string \| null` |
| `refetch` | `() => Promise<void>` |

Endpoint: `GET /api/schema-matches`.

## `useUsers`

CRUD de usuarios (admin).

| Retorno | Tipo |
|---------|------|
| `users` | `User[]` |
| `loading` | `boolean` |
| `error` | `string \| null` |
| `refetch` | `() => Promise<void>` |
| `deleteUser(id)` | `Promise<void>` |

Endpoint: `GET /api/users`, `DELETE /api/users/{id}`.
