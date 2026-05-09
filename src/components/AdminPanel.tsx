import { useIntegrations } from '../hooks/useIntegrations';
import { useUsers } from '../hooks/useUsers';

const staticSystemLogs = [
  { timestamp: '2024-01-15 10:23:45', level: 'INFO', message: 'Sincronización completada' },
  { timestamp: '2024-01-15 09:15:22', level: 'WARN', message: 'Timeout en conexión API' },
  { timestamp: '2024-01-15 08:45:10', level: 'INFO', message: 'Nueva integración añadida' }
];

export default function AdminPanel() {
  const { integrations } = useIntegrations();
  const { users, deleteUser, loading: loadingUsers } = useUsers();

  return (
    <div className="space-y-6">
      {/* Header Admin */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Panel de Administración</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">Gestión completa del sistema</p>
        </div>
        <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-lg">
          <span className="text-purple-400 text-xs font-mono">MODO ADMIN</span>
        </div>
      </div>

      {/* Stats Admin */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-[var(--text-muted)] text-xs">Usuarios Activos</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{users.length}</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-[var(--text-muted)] text-xs">Integraciones</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{integrations.length}</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-[var(--text-muted)] text-xs">Registros Sincronizados</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">0</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4">
          <p className="text-[var(--text-muted)] text-xs">Errores (24h)</p>
          <p className="text-2xl font-bold text-red-400">0</p>
        </div>
      </div>

      {/* Gestión de Usuarios */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg">
        <div className="px-4 py-3 border-b border-[var(--border-color)]">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)]">👥 Gestión de Usuarios</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[var(--text-muted)] border-b border-[var(--border-color)]">
              <tr>
                <th className="text-left px-4 py-3">Usuario</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Rol</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr><td colSpan={5} className="px-4 py-3 text-[var(--text-muted)]">Cargando usuarios...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-3 text-[var(--text-muted)]">No hay usuarios registrados.</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-[var(--border-color)]/50">
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{user.username}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                        {user.roles && user.roles.length > 0 ? user.roles[0] : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={user.status === 'ACTIVE' ? "text-green-400" : "text-[var(--text-muted)]"}>
                        ● {user.status || 'Activo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs del Sistema */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg">
        <div className="px-4 py-3 border-b border-[var(--border-color)]">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)]">📋 Logs del Sistema</h3>
        </div>
        <div className="space-y-1 p-2 font-mono text-xs">
          {staticSystemLogs.map((log: any, idx: number) => (
             <div key={idx} className="text-[var(--text-muted)] py-1">[{log.timestamp}] {log.level} - {log.message}</div>
          ))}
        </div>
      </div>
    </div>
  );
}