import { useState } from 'react';
import { X, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Props {
  onClose: () => void;
}

export default function ChangePasswordModal({ onClose }: Props) {
  const { userData } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      if (!userData?.id) throw new Error('Usuario no encontrado');
      
      const data = {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        password: newPassword
      };
      
      await api.put(`/api/users/${userData.id}`, data);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setError('Ocurrió un error al cambiar la contraseña. Verifica tus datos.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl border border-slate-200 w-full max-w-sm shadow-xl p-6 text-center animate-in">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Contraseña Actualizada</h3>
          <p className="text-sm text-slate-500 mt-1">Tu contraseña ha sido cambiada exitosamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-slate-200 w-full max-w-sm shadow-xl animate-in">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Lock size={16} className="text-slate-500" />
            Cambiar Contraseña
          </h3>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Nueva Contraseña</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value.trim())} required minLength={6}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="••••••••" />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Confirmar Nueva Contraseña</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value.trim())} required minLength={6}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="••••••••" />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="pt-2">
            <button type="submit" disabled={loading || !newPassword || !confirmPassword}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
