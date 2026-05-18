import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post('/api/users/reset-password', { token, newPassword: password });
      setSuccess(true);
    } catch {
      setError('El enlace es inválido o ha expirado. Solicita un nuevo restablecimiento.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white/90 border-slate-200/80";
  const labelClass = "mb-1.5 block text-xs font-medium text-slate-700";

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Enlace inválido</h2>
          <p className="text-sm text-slate-500 mb-6">El enlace de restablecimiento no es válido o falta el token.</p>
          <button onClick={() => navigate('/auth')}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors">
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex">
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white mb-4 shadow-lg shadow-emerald-600/25">
              <Zap size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Restablecer Contraseña</h1>
            <p className="text-sm text-slate-600 mt-1">Ingresa tu nueva contraseña</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl p-8 shadow-xl shadow-slate-200/50">
            {success ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Contraseña actualizada</h3>
                <p className="text-sm text-slate-500">
                  Tu contraseña se ha restablecido exitosamente.
                </p>
                <button onClick={() => navigate('/auth')}
                  className="mt-4 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors">
                  Iniciar Sesión
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className={labelClass}>Nueva Contraseña</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input id="password" type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password" placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className={inputClass} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input id="confirmPassword" type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password" placeholder="••••••••"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass} />
                  </div>
                </div>

                {error && <div className="rounded-lg border border-red-200 bg-red-50/90 px-3 py-2.5 text-xs text-red-600 backdrop-blur-sm">{error}</div>}

                <button type="submit" disabled={loading || !password.trim() || !confirmPassword.trim()}
                  className="group relative w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60 shadow-lg shadow-emerald-600/25">
                  {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                  {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-1/2 bg-gradient-to-br from-emerald-50/30 via-slate-50 to-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#10b98115,_transparent_50%)]" />
      </div>
    </div>
  );
}
