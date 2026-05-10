import { useState, useEffect } from 'react';
import { Users, Search, Trash2, Shield, Mail, MailCheck, X, Loader2, Clock, MapPin, Calendar, Activity, Plus } from 'lucide-react';
import api from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  roles: string[];
}

interface UserFormData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({ username: '', email: '', password: '', firstName: '', lastName: '' });
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createData, setCreateData] = useState<UserFormData>({ username: '', email: '', password: '', firstName: '', lastName: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: number, data: Partial<User>) => {
    try {
      await api.put(`/api/users/${userId}`, data);
      setUsers(users.map(u => u.id === userId ? { ...u, ...data } : u));
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError('No se pudo actualizar el usuario');
    }
  };

  const deleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await api.delete(`/api/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError('No se pudo eliminar el usuario');
    }
  };

  const verifyEmail = async (userId: number) => {
    try {
      setVerifying(String(userId));
      await api.post(`/api/users/${userId}/verify-email`);
      setUsers(users.map(u => u.id === userId ? { ...u, emailVerifiedAt: new Date().toISOString() } : u));
    } catch (err: any) {
      console.error('Error verifying email:', err);
      setError('No se pudo verificar el correo');
    } finally {
      setVerifying(null);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      firstName: user.firstName || '',
      lastName: user.lastName || ''
    });
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', firstName: '', lastName: '' });
  };

  const saveUser = async () => {
    if (!editingUser) return;
    try {
      setSaving(true);
      const payload = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName
      };
      if (formData.password) {
        Object.assign(payload, { password: formData.password });
      }
      await api.put(`/api/users/${editingUser.id}`, payload);
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...payload, updatedAt: new Date().toISOString() } : u));
      closeEditModal();
    } catch (err: any) {
      console.error('Error saving user:', err);
      setError('No se pudo guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const createUser = async () => {
    try {
      setCreating(true);
      const response = await api.post('/api/users/register', {
        username: createData.username,
        email: createData.email,
        password: createData.password,
        firstName: createData.firstName,
        lastName: createData.lastName
      });
      setUsers([response.data, ...users]);
      setShowCreateModal(false);
      setCreateData({ username: '', email: '', password: '', firstName: '', lastName: '' });
    } catch (err: any) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.message || 'No se pudo crear el usuario');
    } finally {
      setCreating(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Usuario
          </button>
          <div className="text-sm text-[var(--text-muted)]">
            {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Usuario</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Roles</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Último Login</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Creado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <span className="font-medium text-[var(--text-primary)]">{user.username}</span>
                        <span className="text-xs text-[var(--text-muted)] ml-2">#{user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text-secondary)]">{user.email}</span>
                      {user.emailVerifiedAt ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-400">
                          <MailCheck className="w-3 h-3" /> Verificado
                        </span>
                      ) : (
                        <button
                          onClick={() => verifyEmail(user.id)}
                          disabled={verifying === String(user.id)}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors disabled:opacity-50"
                          title="Verificar correo"
                        >
                          {verifying === String(user.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : user.status === 'pending_verification'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      <Activity className="w-3 h-3" />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                          <Shield className="w-3 h-3" />
                          {role.replace('ROLE_', '')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.lastLoginAt ? (
                      <div className="flex flex-col text-xs">
                        <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                          <Clock className="w-3 h-3" />
                          {new Date(user.lastLoginAt).toLocaleString('es-CL')}
                        </div>
                        {user.lastLoginIp && (
                          <div className="flex items-center gap-1 text-[var(--text-muted)]">
                            <MapPin className="w-3 h-3" />
                            {user.lastLoginIp}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">Nunca</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.createdAt).toLocaleDateString('es-CL')}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-purple-400 transition-colors"
                        title="Editar usuario"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-red-400 transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
            <Users className="w-12 h-12 mb-3 opacity-50" />
            <p>No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Editar Usuario</h3>
              <button
                onClick={closeEditModal}
                className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Password (dejar vacío para mantener)</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-4 py-3 border-t border-[var(--border-color)]">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveUser}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Crear Nuevo Usuario</h3>
              <button
                onClick={() => { setShowCreateModal(false); setCreateData({ username: '', email: '', password: '', firstName: '', lastName: '' }); }}
                className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Username *</label>
                <input
                  type="text"
                  value={createData.username}
                  onChange={(e) => setCreateData({ ...createData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Usuario"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Email *</label>
                <input
                  type="email"
                  value={createData.email}
                  onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-muted)] mb-1">Password *</label>
                <input
                  type="password"
                  value={createData.password}
                  onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">First Name</label>
                  <input
                    type="text"
                    value={createData.firstName}
                    onChange={(e) => setCreateData({ ...createData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--text-muted)] mb-1">Last Name</label>
                  <input
                    type="text"
                    value={createData.lastName}
                    onChange={(e) => setCreateData({ ...createData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Apellido"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-4 py-3 border-t border-[var(--border-color)]">
              <button
                onClick={() => { setShowCreateModal(false); setCreateData({ username: '', email: '', password: '', firstName: '', lastName: '' }); }}
                className="px-4 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={createUser}
                disabled={creating || !createData.username || !createData.email || !createData.password}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}