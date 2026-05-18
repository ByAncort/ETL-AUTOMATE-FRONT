import { useState, useEffect } from 'react';
import { useIntegrations } from '../hooks/useIntegrations';
import { useUsers } from '../hooks/useUsers';
import { Users, GitMerge, Activity, AlertCircle, Shield } from 'lucide-react';
import { fetchLogs } from '../services/logService';
import { addNotification } from '../services/notificationService';
import type { LogEntry } from '../types';

export default function AdminPanel() {
  const { integrations } = useIntegrations();
  const { users, deleteUser, loading: loadingUsers } = useUsers();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    fetchLogs()
      .then(setLogs)
      .catch(() => setLogs([]))
      .finally(() => setLoadingLogs(false));
  }, []);

  const stats = [
    { icon: <Users size={16} className="text-violet-600" />, label: 'Usuarios Activos', value: users.length },
    { icon: <GitMerge size={16} className="text-blue-600" />, label: 'Integraciones', value: integrations.length },
    { icon: <Activity size={16} className="text-emerald-600" />, label: 'Registros Sincronizados', value: '0' },
    { icon: <AlertCircle size={16} className="text-red-500" />, label: 'Errores (24h)', value: '0' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Panel de Administración</h1>
          <p className="text-slate-500 text-sm mt-1">Gestión completa del sistema</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg">
          <Shield size={14} className="text-violet-600" />
          <span className="text-violet-700 text-xs font-semibold">ADMIN</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 border border-slate-200">
                {s.icon}
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Users size={14} className="text-violet-600" />
            Gestión de Usuarios
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Usuario</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Rol</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-left px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr><td colSpan={5} className="px-4 py-3 text-slate-400">Cargando usuarios...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-3 text-slate-400">No hay usuarios registrados.</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 text-slate-700">{user.username}</td>
                    <td className="px-4 py-3 text-slate-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-violet-50 text-violet-700 rounded text-xs font-medium">
                        {user.roles && user.roles.length > 0 ? user.roles[0].replace('ROLE_', '') : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-600 text-xs">● {user.status || 'Activo'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => {
                        deleteUser(user.id);
                        addNotification('system', 'Usuario eliminado', `El usuario ${user.username} ha sido eliminado del sistema`);
                      }}
                        className="text-red-500 hover:text-red-600 text-xs font-medium">
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

      <div className="bg-white border border-slate-200 rounded-xl">
        <div className="px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Activity size={14} className="text-blue-600" />
            Logs del Sistema
          </h3>
        </div>
        <div className="space-y-1 p-3 font-mono text-xs max-h-64 overflow-y-auto">
          {loadingLogs ? (
            <div className="text-slate-400 py-1">Cargando logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-slate-400 py-1">No hay logs disponibles.</div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="text-slate-500 py-1">
                [{log.timestamp}]{' '}
                <span className={
                  log.level === 'WARN' || log.level === 'WARNING' ? 'text-amber-600' :
                  log.level === 'ERROR' ? 'text-red-500' :
                  'text-slate-600'
                }>{log.level}</span> - {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
