import { useState, useEffect } from 'react';
import { Users, Search, Trash2, Shield, X, Loader2, Plus, Pencil, Power, UserCog, Ban } from 'lucide-react';
import api from '../services/api';
import { addNotification } from '../services/notificationService';
import LoadingState from './ui/LoadingState';
import { useAuth } from '../context/AuthContext';

interface User {
  id: number; username: string; email: string; firstName: string; lastName: string;
  status: string; emailVerifiedAt: string | null; lastLoginAt: string | null;
  lastLoginIp: string | null; createdAt: string; updatedAt: string;
  createdBy: number | null; roles: string[];
}

interface Role {
  id: number;
  name: string;
  description: string;
  levelRole: number | null;
  isSystem: boolean;
  createdAt: string;
}

function decodeToken(token: string): { roles?: string[]; sub?: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')));
    return decoded;
  } catch { return null; }
}

export default function UsersManagement() {
  const { token, username: currentUsername } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);

  // User CRUD
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', firstName: '', lastName: '' });
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState<Record<string, string>>({ username: '', email: '', password: '', firstName: '', lastName: '' });
  const [creating, setCreating] = useState(false);

  // Role assignment
  const [roleUser, setRoleUser] = useState<User | null>(null);
  const [userRoleIds, setUserRoleIds] = useState<number[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  // Current user's highest role level (lower = higher rank)
  const currentUserHighestLevel = (() => {
    if (!token) return Infinity;
    const decoded = decodeToken(token);
    const currentRoles = decoded?.roles || [];
    const levels = currentRoles.map(rName => {
      const found = roles.find(r => r.name === rName);
      return found?.levelRole ?? Infinity;
    });
    return Math.min(...levels);
  })();

  useEffect(() => { fetchUsers(); fetchRoles(); }, []);

  // ---------- Users ----------

  const fetchUsers = async () => {
    try { setLoading(true); const r = await api.get('/api/users'); setUsers(r.data); } catch { setError('No se pudieron cargar los usuarios'); } finally { setLoading(false); }
  };

  const updateUser = async (userId: number, data: { username: string; email: string; password: string; firstName: string; lastName: string }) => {
    try {
      const body: Record<string, string> = { username: data.username.trim(), email: data.email.trim(), firstName: data.firstName.trim(), lastName: data.lastName.trim() };
      if (data.password.trim()) body.password = data.password.trim();
      await api.put(`/api/users/${userId}`, body);
      setUsers(users.map(u => u.id === userId ? { ...u, username: body.username, email: body.email, firstName: body.firstName, lastName: body.lastName } : u));
      addNotification('system', 'Usuario actualizado', `El usuario ${body.username} ha sido actualizado`);
    } catch { setError('No se pudo actualizar el usuario'); }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try { await api.delete(`/api/users/${userId}`); setUsers(users.filter(u => u.id !== userId)); addNotification('system', 'Usuario eliminado', `Usuario #${userId} eliminado del sistema`); } catch { setError('No se pudo eliminar el usuario'); }
  };

  const verifyEmail = async (userId: number) => {
    try { setVerifying(String(userId)); await api.post(`/api/users/${userId}/verify-email`); setUsers(users.map(u => u.id === userId ? { ...u, emailVerifiedAt: new Date().toISOString() } : u)); addNotification('success', 'Email verificado', `Email del usuario #${userId} verificado exitosamente`); } catch { setError('No se pudo verificar el correo'); } finally { setVerifying(null); }
  };

  const activateUser = async (userId: number) => {
    try { setVerifying(String(userId)); await api.post(`/api/users/${userId}/activate`); setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' } : u)); addNotification('success', 'Usuario activado', `Usuario #${userId} ha sido activado`); } catch { setError('No se pudo activar al usuario'); } finally { setVerifying(null); }
  };

  const deactivateUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de desactivar (bloquear el acceso) a este usuario?')) return;
    try { setVerifying(String(userId)); await api.post(`/api/users/${userId}/deactivate`); setUsers(users.map(u => u.id === userId ? { ...u, status: 'inactive' } : u)); addNotification('system', 'Usuario desactivado', `Usuario #${userId} ha sido desactivado`); } catch { setError('No se pudo desactivar al usuario'); } finally { setVerifying(null); }
  };

  // ---------- Roles ----------

  const fetchRoles = async () => {
    try { const r = await api.get<Role[]>('/api/users/roles'); setRoles(r.data); } catch { setRoles([]); }
  };

  const openRoleModal = async (user: User) => {
    setRoleUser(user);
    setRoleError(null);
    setLoadingRoles(true);
    try {
      const r = await api.get<Role[]>(`/api/users/roles/user/${user.username}`);
      setUserRoleIds(r.data.map(role => role.id));
    } catch {
      setUserRoleIds([]);
    }
    setLoadingRoles(false);
  };

  const canManageRole = (role: Role): boolean => {
    if (role.levelRole == null) return false;
    if (currentUserHighestLevel === Infinity) return false;
    return currentUserHighestLevel <= role.levelRole;
  };

  const toggleUserRole = async (roleId: number) => {
    if (!roleUser) return;
    setRoleError(null);
    const hasRole = userRoleIds.includes(roleId);
    try {
      if (hasRole) {
        await api.delete(`/api/user-roles/remove?userId=${roleUser.id}&roleId=${roleId}`);
        setUserRoleIds(userRoleIds.filter(id => id !== roleId));
        setUsers(users.map(u => u.id === roleUser.id ? { ...u, roles: u.roles.filter(r => r !== roles.find(role => role.id === roleId)?.name) } : u));
        addNotification('system', 'Rol removido', `Rol removido de ${roleUser.username}`);
      } else {
        await api.post('/api/user-roles/assign', { userId: roleUser.id, roleId });
        setUserRoleIds([...userRoleIds, roleId]);
        const roleName = roles.find(r => r.id === roleId)?.name;
        if (roleName) setUsers(users.map(u => u.id === roleUser.id ? { ...u, roles: [...u.roles, roleName] } : u));
        addNotification('success', 'Rol asignado', `Rol asignado a ${roleUser.username}`);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'No se pudo actualizar el rol del usuario';
      setRoleError(msg);
    }
  };

  // ---------- UI ----------

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingState message="Cargando usuarios..." />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Buscar usuarios..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors">
            <Plus size={16} /> Nuevo Usuario
          </button>
          <span className="text-sm text-slate-400">{filtered.length} usuario{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {['Usuario', 'Email', 'Estado', 'Roles', 'Creado', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <Users size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-900">{user.username}</span>
                        <span className="text-xs text-slate-400 ml-2">#{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">{user.email}</span>
                      {user.emailVerifiedAt ? (
                        <span className="text-emerald-500 text-xs font-medium ml-2">Verificado</span>
                      ) : (
                        <button onClick={() => verifyEmail(user.id)} disabled={verifying === String(user.id)}
                          className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded text-xs font-medium transition-colors whitespace-nowrap">
                          {verifying === String(user.id) ? 'Activando...' : 'Por verificar'}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>{user.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {user.roles.map((role, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 mr-1">
                        <Shield size={10} />{role.replace('ROLE_', '')}
                      </span>
                    ))}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {user.status === 'active' ? (
                        <button onClick={() => deactivateUser(user.id)} disabled={verifying === String(user.id)}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors" title="Desactivar Usuario">
                          {verifying === String(user.id) ? <Loader2 size={14} className="animate-spin" /> : <Power size={14} />}
                        </button>
                      ) : (
                        <button onClick={() => activateUser(user.id)} disabled={verifying === String(user.id)}
                          className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 transition-colors" title="Activar Usuario">
                          {verifying === String(user.id) ? <Loader2 size={14} className="animate-spin" /> : <Power size={14} />}
                        </button>
                      )}
                      <button onClick={() => openRoleModal(user)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Gestionar Roles">
                        <UserCog size={14} />
                      </button>
                      <button onClick={() => { setEditingUser(user); setFormData({ username: user.username, email: user.email, password: '', firstName: user.firstName || '', lastName: user.lastName || '' }); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteUser(user.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-slate-400">
            <Users size={40} className="mb-3 opacity-50" />
            <p className="text-sm">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* User Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Editar Usuario</h3>
              <button onClick={() => setEditingUser(null)} className="p-1 rounded text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Username</label>
                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Password (dejar vacío para mantener)</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
                  <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Apellido</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-4 py-3 border-t border-slate-200">
              <button onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button onClick={async () => { setSaving(true); await updateUser(editingUser.id, formData); setSaving(false); setEditingUser(null); }}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Crear Nuevo Usuario</h3>
              <button onClick={() => { setShowCreateModal(false); setCreateData({ username: '', email: '', password: '', firstName: '', lastName: '' }); }}
                className="p-1 rounded text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-4">
              {['username', 'email', 'password'].map(field => (
                <div key={field}>
                  <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">{field} *</label>
                  <input type={field === 'password' ? 'password' : 'text'} value={createData[field]}
                    onChange={(e) => setCreateData({ ...createData, [field]: e.target.value })}
                    placeholder={field === 'email' ? 'email@ejemplo.com' : field === 'password' ? '••••••••' : field}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
                  <input type="text" value={createData.firstName} onChange={(e) => setCreateData({ ...createData, firstName: e.target.value })}
                    placeholder="Nombre" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Apellido</label>
                  <input type="text" value={createData.lastName} onChange={(e) => setCreateData({ ...createData, lastName: e.target.value })}
                    placeholder="Apellido" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-4 py-3 border-t border-slate-200">
              <button onClick={() => { setShowCreateModal(false); setCreateData({ username: '', email: '', password: '', firstName: '', lastName: '' }); }}
                className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancelar</button>
              <button onClick={async () => { setCreating(true); try { const cleanData = { username: createData.username.trim(), email: createData.email.trim(), password: createData.password.trim(), firstName: createData.firstName.trim(), lastName: createData.lastName.trim() }; const r = await api.post('/api/users/register', cleanData); setUsers([r.data, ...users]); setShowCreateModal(false); addNotification('success', 'Usuario creado', `El usuario ${cleanData.username} ha sido registrado`); } catch { setError('No se pudo crear el usuario'); } finally { setCreating(false); } }}
                disabled={creating || !createData.username || !createData.email || !createData.password}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2">
                {creating && <Loader2 size={14} className="animate-spin" />}Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Assignment Modal */}
      {roleUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <UserCog size={16} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">Roles de {roleUser.username}</h3>
              </div>
              <button onClick={() => setRoleUser(null)} className="p-1 rounded text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-1">
              {roleUser.username === currentUsername && (
                <div className="flex items-center gap-2 p-2 mb-2 rounded-lg bg-amber-50 text-amber-700 text-xs">
                  <Ban size={14} /> No puedes modificar tus propios roles
                </div>
              )}
              {roleError && (
                <div className="flex items-center gap-2 p-2 mb-2 rounded-lg bg-red-50 text-red-600 text-xs">
                  <Ban size={14} /> {roleError}
                </div>
              )}
              {loadingRoles ? (
                <div className="flex items-center justify-center py-8"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
              ) : roles.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No hay roles disponibles</p>
              ) : (
                roles.map(role => {
                  const checked = userRoleIds.includes(role.id);
                  const isSelf = roleUser.username === currentUsername;
                  const allowed = canManageRole(role);
                  const disabled = isSelf || !allowed;

                  return (
                    <label key={role.id}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${checked ? 'bg-blue-50' : disabled ? '' : 'hover:bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <Shield size={14} className={checked ? 'text-blue-600' : disabled ? 'text-slate-200' : 'text-slate-300'} />
                        <div>
                          <span className={`text-sm font-medium ${checked ? 'text-blue-900' : 'text-slate-600'}`}>
                            {role.name.replace('ROLE_', '')}
                            {role.levelRole != null && (
                              <span className="text-xs text-slate-400 ml-1 font-normal">(Nvl {role.levelRole})</span>
                            )}
                          </span>
                          <span className="text-xs text-slate-400 ml-2">{role.description}</span>
                          {!allowed && !isSelf && (
                            <span className="text-xs text-amber-600 ml-2">— no tienes permiso</span>
                          )}
                        </div>
                      </div>
                      <input type="checkbox" checked={checked}
                        disabled={disabled}
                        onChange={() => toggleUserRole(role.id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 disabled:opacity-40" />
                    </label>
                  );
                })
              )}
            </div>
            <div className="flex justify-end px-4 py-3 border-t border-slate-200">
              <button onClick={() => setRoleUser(null)}
                className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
