import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../services/api';
import AuthLayout from './AuthLayout';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-[--bg-page]">
        <motion.div
          className="bg-[--bg-card] border border-[--border] rounded-2xl p-8 max-w-sm w-full text-center shadow-sm"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="mx-auto w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500 mb-4">
            <AlertCircle size={20} />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-base font-medium text-[--text-primary] mb-2">Enlace inválido</motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-[--text-secondary] mb-7">El enlace de restablecimiento no es válido o falta el token.</motion.p>
          <motion.button variants={fadeUp} onClick={() => navigate('/auth')}
            className="w-full rounded-xl bg-[--accent] hover:bg-[--accent-hover] py-3 text-sm font-medium text-white transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]">
            Volver al Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthLayout title="Establece una nueva contraseña">
      <div className="relative bg-[--bg-card] border border-[--border] rounded-2xl p-8 shadow-sm">
        {success ? (
          <div className="text-center">
            <div className="mx-auto w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-sm font-medium text-[--text-primary] mb-2">Contraseña actualizada</h3>
            <p className="text-sm text-[--text-secondary] mb-7">Tu contraseña se ha restablecido exitosamente.</p>
            <button onClick={() => navigate('/auth')}
              className="w-full rounded-xl bg-[--accent] hover:bg-[--accent-hover] py-3 text-sm font-medium text-white transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]">
              Iniciar Sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-muted]" />
                <input id="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[--border] bg-[--bg-card] py-3 pl-10 pr-10 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)]" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text-secondary] transition-colors"
                  aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-muted]" />
                <input id="confirmPassword" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" placeholder="••••••••"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-[--border] bg-[--bg-card] py-3 pl-10 pr-10 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)]" />
              </div>
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-[11px] text-red-600 font-medium">{error}</div>}

            <button type="submit" disabled={loading || !password.trim() || !confirmPassword.trim()}
              className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-[--accent] hover:bg-[--accent-hover] py-3 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]">
              {loading ? 'Restableciendo…' : 'Restablecer Contraseña'}
              {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
