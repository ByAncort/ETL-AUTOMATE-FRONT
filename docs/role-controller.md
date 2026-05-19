# RoleController — Documentación para Frontend

Base URL: `http://localhost:8083/api`

---

## 1. RoleController (`/api/roles`)

### 1.1 Crear rol

```
POST /api/roles
```

**Request body:**
```json
{
  "name": "ROLE_ADMIN",
  "description": "Administrador del sistema",
  "levelRole": 1,
  "isSystem": false
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `name` | string | sí | Nombre del rol (único) |
| `description` | string | sí | Descripción del rol |
| `levelRole` | number | no | Nivel jerárquico del rol |
| `isSystem` | boolean | no | Si es rol del sistema (default: `false`) |

**Response `201 Created`:**
```json
{
  "id": 5,
  "name": "ROLE_ADMIN",
  "description": "Administrador del sistema",
  "levelRole": 1,
  "isSystem": false,
  "createdAt": "2025-05-18T14:30:00"
}
```

**Errores:**
- `409 Conflict` — ya existe un rol con ese nombre
- `400 Bad Request` — validación fallida (`name` o `description` vacíos)

---

### 1.2 Obtener rol por ID

```
GET /api/roles/{id}
```

**Response `200 OK`:**
```json
{
  "id": 1,
  "name": "ROLE_ADMIN",
  "description": "Administrador del sistema",
  "levelRole": 1,
  "isSystem": true,
  "createdAt": "2025-01-01T00:00:00"
}
```

**Errores:**
- `404 Not Found` — no existe rol con ese ID

---

### 1.3 Listar todos los roles

```
GET /api/roles
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "ROLE_ADMIN",
    "description": "Administrador del sistema",
    "levelRole": 1,
    "isSystem": true,
    "createdAt": "2025-01-01T00:00:00"
  },
  {
    "id": 2,
    "name": "ROLE_USER",
    "description": "Usuario estándar",
    "levelRole": 2,
    "isSystem": true,
    "createdAt": "2025-01-01T00:00:00"
  }
]
```

---

### 1.4 Obtener roles por username

```
GET /api/roles/user/{username}
```

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "ROLE_ADMIN",
    "description": "Administrador del sistema",
    "levelRole": 1,
    "isSystem": true,
    "createdAt": "2025-01-01T00:00:00"
  }
]
```

**Errores:**
- `404 Not Found` — no existe el usuario

---

### 1.5 Actualizar rol

```
PUT /api/roles/{id}
```

**Request body:** (mismo que crear rol)
```json
{
  "name": "ROLE_MODERATOR",
  "description": "Moderador del sistema",
  "levelRole": 3,
  "isSystem": false
}
```

**Response `200 OK`:**
```json
{
  "id": 3,
  "name": "ROLE_MODERATOR",
  "description": "Moderador del sistema",
  "levelRole": 3,
  "isSystem": false,
  "createdAt": "2025-03-01T10:00:00"
}
```

**Errores:**
- `404 Not Found` — no existe el rol
- `400 Bad Request` — nombre duplicado o validación fallida
- `403 Forbidden` — no se puede modificar un rol de sistema (`isSystem = true`)

---

### 1.6 Eliminar rol

```
DELETE /api/roles/{id}
```

**Response `204 No Content`** (sin body)

**Errores:**
- `404 Not Found` — no existe el rol
- `403 Forbidden` — no se puede eliminar un rol de sistema (`isSystem = true`)
- `409 Conflict` — el rol está asignado a uno o más usuarios

---

## 2. UserRoleController (`/api/user-roles`)

### 2.1 Asignar rol a usuario

```
POST /api/user-roles/assign
```

**Request body:**
```json
{
  "userId": 1,
  "roleId": 2,
  "assignedBy": 1
}
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `userId` | number | sí | ID del usuario |
| `roleId` | number | sí | ID del rol |
| `assignedBy` | number | no | ID del usuario que asigna |

**Response `200 OK`** (sin body)

**Errores:**
- `404 Not Found` — usuario o rol no existen
- `409 Conflict` — el usuario ya tiene ese rol asignado

---

### 2.2 Remover rol de usuario

```
DELETE /api/user-roles/remove?userId=1&roleId=2
```

| Parámetro | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `userId` | number | sí | ID del usuario |
| `roleId` | number | sí | ID del rol |

**Response `204 No Content`** (sin body)

**Errores:**
- `404 Not Found` — el usuario no tiene ese rol asignado

---

## 3. TypeScript Interfaces

```typescript
// ---------- Role ----------

export interface RoleResponse {
  id: number;
  name: string;
  description: string;
  levelRole: number | null;
  isSystem: boolean;
  createdAt: string; // ISO 8601
}

export interface RoleRequest {
  name: string;
  description: string;
  levelRole?: number | null;
  isSystem?: boolean; // default: false
}

// ---------- UserRole ----------

export interface AssignRoleRequest {
  userId: number;
  roleId: number;
  assignedBy?: number | null;
}
```

---

## 4. Role IDs conocidos (seed)

| ID | Nombre | Descripción |
|---|---|---|
| `1` | `ROLE_ADMIN` | Administrador del sistema |
| `2` | `ROLE_USER` | Usuario estándar |
| `3` | `ROLE_MODERATOR` | Moderador |
| `4` | `ROLE_GUEST` | Invitado (asignado por defecto al crear usuario) |

---

## 5. Notas importantes

- Los roles con `isSystem = true` **no pueden ser modificados ni eliminados** desde la API.
- El rol `ROLE_GUEST` (id: 4) se asigna automáticamente a todo usuario nuevo.
- No se puede eliminar un usuario que tenga `ROLE_MODERATOR` (id: 3).
- Los roles viajan en el JWT como claims y se usan para autorización en el gateway.
- `assignedBy` en `AssignRoleRequest` es opcional; si no se envía, queda `null`.
