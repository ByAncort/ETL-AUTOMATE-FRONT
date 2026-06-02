import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { motion } from 'motion/react';

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
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
      <div className="min-h-screen flex items-center justify-center p-8" style={{ fontFamily: 'Outfit, sans-serif' }}>
        <motion.div
          className="bg-white/90 backdrop-blur-sm border border-[#5741d8]/[0.08] rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_1px_3px_0_rgb(87_65_216/0.04),0_1px_2px_-1px_rgb(87_65_216/0.06)]"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="mx-auto w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500 mb-4">
            <AlertCircle size={20} />
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-base font-medium text-[#0a0a0a] mb-2">Enlace inválido</motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-[#0a0a0a]/50 mb-7">El enlace de restablecimiento no es válido o falta el token.</motion.p>
          <motion.button variants={fadeUp} onClick={() => navigate('/auth')}
            className="w-full rounded-xl bg-gradient-to-b from-[#5741d8] to-[#4635b5] hover:from-[#5d47e0] hover:to-[#4d39c4] py-3 text-sm font-medium text-white/90 transition-all duration-200 shadow-[0_1px_2px_rgb(87_65_216/0.3)] hover:shadow-[0_2px_8px_rgb(87_65_216/0.35)] active:scale-[0.98]">
            Volver al Login
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#5741d8]/[0.06] to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-[#5741d8]/[0.04] to-transparent blur-2xl" />
      </div>

      {/* Left: form */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.25]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #5741d8 0.5px, transparent 0)`,
            backgroundSize: '32px 32px',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
          }}
        />

        <motion.div
          className="w-full max-w-sm"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="mb-10">
            <div className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#5741d8]/50 mb-4">
              Data Platform
            </div>
            <h1 className="text-[30px] font-semibold tracking-tight text-[#0a0a0a] leading-none">
              Restablecer Contraseña
            </h1>
            <div className="mt-4 h-px w-12 bg-gradient-to-r from-[#5741d8]/30 to-transparent" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative bg-white/90 backdrop-blur-sm border border-[#5741d8]/[0.08] rounded-2xl p-8 shadow-[0_1px_3px_0_rgb(87_65_216/0.04),0_1px_2px_-1px_rgb(87_65_216/0.06)]"
          >
            {success ? (
              <motion.div
                className="text-center"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeUp} className="mx-auto w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                  <CheckCircle2 size={20} />
                </motion.div>
                <motion.h3 variants={fadeUp} className="text-sm font-medium text-[#0a0a0a] mb-2">Contraseña actualizada</motion.h3>
                <motion.p variants={fadeUp} className="text-sm text-[#0a0a0a]/50 mb-7">Tu contraseña se ha restablecido exitosamente.</motion.p>
                <motion.button variants={fadeUp} onClick={() => navigate('/auth')}
                  className="w-full rounded-xl bg-gradient-to-b from-[#5741d8] to-[#4635b5] hover:from-[#5d47e0] hover:to-[#4d39c4] py-3 text-sm font-medium text-white/90 transition-all duration-200 shadow-[0_1px_2px_rgb(87_65_216/0.3)] hover:shadow-[0_2px_8px_rgb(87_65_216/0.35)] active:scale-[0.98]">
                  Iniciar Sesión
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5741d8]/60">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5741d8]/40" />
                    <input id="password" type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password" placeholder="••••••••"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#0a0a0a]/[0.08] bg-white py-3 pl-10 pr-10 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-all duration-200 focus:border-[#5741d8]/40 focus:shadow-[0_0_0_4px_rgba(87,65,216,0.08)]" />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0a0a0a]/30 hover:text-[#0a0a0a]/50 transition-colors"
                      aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5741d8]/60">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5741d8]/40" />
                    <input id="confirmPassword" type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password" placeholder="••••••••"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-[#0a0a0a]/[0.08] bg-white py-3 pl-10 pr-10 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-all duration-200 focus:border-[#5741d8]/40 focus:shadow-[0_0_0_4px_rgba(87,65,216,0.08)]" />
                  </div>
                </div>

                {error && <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-[11px] text-red-600 font-medium">{error}</div>}

                <button type="submit" disabled={loading || !password.trim() || !confirmPassword.trim()}
                  className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#5741d8] to-[#4635b5] hover:from-[#5d47e0] hover:to-[#4d39c4] py-3 text-sm font-medium text-white/90 transition-all duration-200 disabled:opacity-50 shadow-[0_1px_2px_rgb(87_65_216/0.3)] hover:shadow-[0_2px_8px_rgb(87_65_216/0.35)] active:scale-[0.98]">
                  {loading ? 'Restableciendo…' : 'Restablecer Contraseña'}
                  {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Right: visual */}
      <div className="hidden lg:flex items-center justify-center w-1/2 bg-gradient-to-br from-[#5741d8]/[0.03] via-slate-50 to-white overflow-hidden p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(87,65,216,0.03)_0%,transparent_70%)]" />
        <div className="w-full max-w-lg aspect-square rounded-2xl bg-white/80 border border-[#5741d8]/[0.08] flex items-center justify-center relative z-10">
          <div className="text-center">
            <div className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#0a0a0a]/30 mb-2">ETL Automate</div>
            <div className="w-6 h-px bg-gradient-to-r from-[#5741d8]/30 to-transparent mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
