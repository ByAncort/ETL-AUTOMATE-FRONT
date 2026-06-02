import { useState } from 'react';
import { Lock, User, ArrowRight, Mail, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GlobeCdn } from './ui/cobe-globe-cdn';
import { motion } from 'motion/react';

const registerSchema = z.object({
  username: z.string().trim().min(3, 'Mínimo 3 caracteres').max(50, 'Máximo 50 caracteres').regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo (sin espacios)'),
  email: z.string().trim().email('Debe ser un email válido').toLowerCase().max(100, 'Máximo 100 caracteres').regex(/^[^\s]+$/, 'El email no debe tener espacios'),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(100, 'Máximo 100 caracteres').regex(/^[^\s]+$/, 'La contraseña no debe tener espacios'),
  confirmPassword: z.string(),
  firstName: z.string().trim().min(1, 'Nombre requerido').max(50, 'Máximo 50 caracteres').regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/, 'Solo letras sin tildes, ni espacios al final/inicio'),
  lastName: z.string().trim().min(1, 'Apellido requerido').max(50, 'Máximo 50 caracteres').regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/, 'Solo letras sin tildes, ni espacios al final/inicio'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

interface Props { onToggleForm: () => void }

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

export default function Register({ onToggleForm }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setError(null); setSuccess(null); setLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      await api.post('/api/users/register', payload);
      setSuccess('Usuario creado exitosamente. Tu cuenta está pendiente de ser activada por un administrador. Redirigiendo...');
      setTimeout(() => onToggleForm(), 4000);
    } catch {
      setError('No se pudo registrar. Quizás el usuario/email ya existe.');
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
              Crear Cuenta
            </h2>

            {success ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[11px] text-emerald-700 text-center font-medium">{success}</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="reg-username" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5741d8]/60">
                    Usuario
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5741d8]/40" />
                    <input id="reg-username" type="text" autoComplete="username" placeholder="usuario" {...register('username')}
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-all duration-200 focus:border-[#5741d8]/40 focus:shadow-[0_0_0_4px_rgba(87,65,216,0.08)] ${errors.username ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#0a0a0a]/[0.08]'}`} />
                  </div>
                  {errors.username && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.username.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-firstname" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5741d8]/60">
                      Nombre
                    </label>
                    <input id="reg-firstname" type="text" autoComplete="given-name" placeholder="Nombre" {...register('firstName')}
                      className={`w-full rounded-xl border bg-white py-3 px-4 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-all duration-200 focus:border-[#5741d8]/40 focus:shadow-[0_0_0_4px_rgba(87,65,216,0.08)] ${errors.firstName ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#0a0a0a]/[0.08]'}`} />
                    {errors.firstName && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="reg-lastname" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5741d8]/60">
                      Apellido
                    </label>
                    <input id="reg-lastname" type="text" autoComplete="family-name" placeholder="Apellido" {...register('lastName')}
                      className={`w-full rounded-xl border bg-white py-3 px-4 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-all duration-200 focus:border-[#5741d8]/40 focus:shadow-[0_0_0_4px_rgba(87,65,216,0.08)] ${errors.lastName ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#0a0a0a]/[0.08]'}`} />
                    {errors.lastName && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5741d8]/60">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5741d8]/40" />
                    <input id="reg-email" type="email" autoComplete="email" placeholder="email@ejemplo.com" {...register('email')}
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-all duration-200 focus:border-[#5741d8]/40 focus:shadow-[0_0_0_4px_rgba(87,65,216,0.08)] ${errors.email ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#0a0a0a]/[0.08]'}`} />
                  </div>
                  {errors.email && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="reg-password" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5741d8]/60">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5741d8]/40" />
                    <input id="reg-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                      placeholder="••••••••" {...register('password')}
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-10 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-all duration-200 focus:border-[#5741d8]/40 focus:shadow-[0_0_0_4px_rgba(87,65,216,0.08)] ${errors.password ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#0a0a0a]/[0.08]'}`} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0a0a0a]/30 hover:text-[#0a0a0a]/50 transition-colors"
                      aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="reg-confirm-password" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[#5741d8]/60">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#5741d8]/40" />
                    <input id="reg-confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                      placeholder="••••••••" {...register('confirmPassword')}
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-10 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/25 outline-none transition-all duration-200 focus:border-[#5741d8]/40 focus:shadow-[0_0_0_4px_rgba(87,65,216,0.08)] ${errors.confirmPassword ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[#0a0a0a]/[0.08]'}`} />
                  </div>
                  {errors.confirmPassword && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.confirmPassword.message}</p>}
                </div>

                {error && <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-[11px] text-red-600 font-medium">{error}</div>}

                <button type="submit" disabled={loading}
                  className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#5741d8] to-[#4635b5] hover:from-[#5d47e0] hover:to-[#4d39c4] py-3 text-sm font-medium text-white/90 transition-all duration-200 disabled:opacity-50 shadow-[0_1px_2px_rgb(87_65_216/0.3)] hover:shadow-[0_2px_8px_rgb(87_65_216/0.35)] active:scale-[0.98]">
                  {loading ? 'Creando cuenta…' : 'Crear Cuenta'}
                  {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />}
                </button>
              </form>
            )}

            <p className="mt-7 text-center text-[11px] text-[#0a0a0a]/40">
              ¿Ya tienes cuenta?{' '}
              <button onClick={onToggleForm} className="text-[#5741d8] hover:text-[#4635b5] font-medium transition-colors">
                Inicia Sesión
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
