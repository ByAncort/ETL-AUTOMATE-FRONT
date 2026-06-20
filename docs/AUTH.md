# Flujo de Autenticación

## AuthContext (`context/AuthContext.tsx`)

Estado global de autenticación usando React Context.

### Estado

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `isAuthenticated` | `boolean` | Token presente y válido |
| `token` | `string \| null` | JWT almacenado |
| `isAdmin` | `boolean` | Token contiene `ROLE_ADMIN` |
| `viewAdmin` | `boolean` | Vista admin habilitada |
| `username` | `string \| null` | Username del token (sub claim) |
| `userData` | `UserData \| null` | Datos completos del usuario |

### Métodos

| Método | Descripción |
|--------|-------------|
| `login(token)` | Guarda token en localStorage, decodifica JWT, obtiene userData |
| `logout()` | Limpia localStorage, resetea estado |
| `setViewAdmin(value)` | Solo permite activar si `isAdmin` es true |
| `refetchUser()` | Recarga userData desde API |

### JWT Decode

El token se decodifica manualmente (sin librería) desde `localStorage.getItem('token')`.

Claims extraídos:
- `sub` → `username`
- `roles` → contiene `ROLE_ADMIN` para identificar admin

### Flujo login

```
Login form → API /auth → JWT → login(token) → decode → isAdmin + username
→ fetchUserData(/api/users/username/{sub}) → userData completo
```

### Persistencia

| Key | Valor |
|-----|-------|
| `token` | JWT string |
| `username` | sub del JWT |
| `viewAdmin` | `"true"` o `"false"` |

### Interceptor 401

`api.ts` response interceptor: si recibe 401 y no está en `/auth` o `/reset-password`, limpia todo y redirige a `/auth`.
