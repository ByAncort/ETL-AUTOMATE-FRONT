import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GlobeCdn } from './ui/cobe-globe-cdn';
import { motion } from 'motion/react';

const loginSchema = z.object({
  username: z.string().trim().min(1, 'El nombre de usuario es requerido'),
  password: z.string().trim().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface Props {
  onToggleForm?: () => void;
  onForgot?: () => void;
}

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

const P = '#5741d8';

export default function Login({ onToggleForm, onForgot }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.post('/api/v1/auth/token', { username: data.username, password: data.password });
      const token = response.data.accessToken;
      if (token) { login(token); }
      else { setError('Respuesta inesperada del servidor.'); }
    } catch {
      setError('Credenciales inválidas o error de conexión.');
    } finally { setLoading(false); }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden" style={{ fontFamily: 'Outfit, sans-serif' }}>
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#5741d8]/[0.06] to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-[#5741d8]/[0.04] to-transparent blur-2xl" />
      </div>

      {/* Left: form */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        {/* Subtle dot-grid pattern */}
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
              ETL Automate
            </h1>
            <div className="mt-4 h-px w-12 bg-gradient-to-r from-[#5741d8]/30 to-transparent" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative bg-white/90 backdrop-blur-sm border border-[#5741d8]/[0.08] rounded-2xl p-8 shadow-[0_1px_3px_0_rgb(87_65_216/0.04),0_1px_2px_-1px_rgb(87_65_216/0.06)]"
          >
            <h2 className="text-[13px] font-medium text-[#5741d8]/80 mb-7 tracking-tight">
              Iniciar Sesión
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div>
                <label htmlFor="username" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5741d8]/60">
                  Usuario
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5741d8]/40" />
                  <input id="username" type="text" autoComplete="username"
                    placeholder="nombre de usuario" {...register('username')}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-all duration-200 focus:border-[#5741d8]/40 focus:shadow-[0_0_0_4px_rgba(87,65,216,0.08)] ${errors.username ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#0a0a0a]/[0.08]'}`} />
                </div>
                {errors.username && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.username.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#5741d8]/60">
                    Contraseña
                  </label>
                  <button type="button" onClick={onForgot} className="text-[11px] text-[#5741d8]/50 hover:text-[#5741d8]/80 transition-colors">
                    ¿Olvidaste?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5741d8]/40" />
                  <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                    placeholder="••••••••" {...register('password')}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-10 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-all duration-200 focus:border-[#5741d8]/40 focus:shadow-[0_0_0_4px_rgba(87,65,216,0.08)] ${errors.password ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#0a0a0a]/[0.08]'}`} />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0a0a0a]/30 hover:text-[#0a0a0a]/50 transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.password.message}</p>}
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-[11px] text-red-600 font-medium">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#5741d8] to-[#4635b5] hover:from-[#5d47e0] hover:to-[#4d39c4] py-3 text-sm font-medium text-white/90 transition-all duration-200 disabled:opacity-50 shadow-[0_1px_2px_rgb(87_65_216/0.3)] hover:shadow-[0_2px_8px_rgb(87_65_216/0.35)] active:scale-[0.98]">
                {loading ? 'Iniciando sesión…' : 'Iniciar Sesión'}
                {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />}
              </button>
            </form>

            <p className="mt-7 text-center text-[11px] text-[#0a0a0a]/40">
              ¿No tienes cuenta?{' '}
              <button onClick={onToggleForm} className="text-[#5741d8] hover:text-[#4635b5] font-medium transition-colors">
                Regístrate
              </button>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right: globe */}
      <div className="hidden lg:flex items-center justify-center w-1/2 bg-gradient-to-br from-[#5741d8]/[0.03] via-slate-50 to-white overflow-hidden p-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(87,65,216,0.03)_0%,transparent_70%)]" />
        <div className="w-full max-w-lg relative z-10">
          <GlobeCdn />
        </div>
      </div>
    </div>
  );
}
