import { useState } from 'react';
import { Lock, User, ArrowRight, Mail, Eye, EyeOff, Zap } from 'lucide-react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import GlobeCanvas from './ui/GlobeCanvas';

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

  const inputClass = "w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white/90 border-slate-200/80";
  const inputPlain = "w-full rounded-lg border py-2.5 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white/90 border-slate-200/80";
  const labelClass = "mb-1.5 block text-xs font-medium text-slate-700";

  return (
    <div className="relative min-h-screen flex">
      {/* Left: card */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white mb-4 shadow-lg shadow-emerald-600/25">
              <Zap size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">ETL Automate</h1>
            <p className="text-sm text-slate-600 mt-1">Crea tu cuenta</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl p-8 shadow-xl shadow-slate-200/50">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-600">Nuevo usuario</p>
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Crear Cuenta</h2>

            {success ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/90 px-3 py-3 text-xs text-emerald-700 text-center backdrop-blur-sm">{success}</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="reg-username" className={labelClass}>Usuario</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input id="reg-username" type="text" autoComplete="username" placeholder="usuario" {...register('username')}
                      className={`${inputClass} ${errors.username ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} />
                  </div>
                  {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-firstname" className={labelClass}>Nombre</label>
                    <input id="reg-firstname" type="text" autoComplete="given-name" placeholder="Nombre" {...register('firstName')}
                      className={`${inputPlain} ${errors.firstName ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} />
                    {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="reg-lastname" className={labelClass}>Apellido</label>
                    <input id="reg-lastname" type="text" autoComplete="family-name" placeholder="Apellido" {...register('lastName')}
                      className={`${inputPlain} ${errors.lastName ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} />
                    {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className={labelClass}>Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input id="reg-email" type="email" autoComplete="email" placeholder="email@ejemplo.com" {...register('email')}
                      className={`${inputClass} ${errors.email ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="reg-password" className={labelClass}>Contraseña</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input id="reg-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                      placeholder="••••••••" {...register('password')}
                      className={`${inputClass} ${errors.password ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="reg-confirm-password" className={labelClass}>Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input id="reg-confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                      placeholder="••••••••" {...register('confirmPassword')}
                      className={`${inputClass} ${errors.confirmPassword ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                {error && <div className="rounded-lg border border-red-200 bg-red-50/90 px-3 py-2.5 text-xs text-red-600 backdrop-blur-sm">{error}</div>}

                <button type="submit" disabled={loading}
                  className="group relative w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60 shadow-lg shadow-emerald-600/25">
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-xs text-slate-500">
              ¿Ya tienes cuenta?{' '}
              <button onClick={onToggleForm} className="text-emerald-600 hover:text-emerald-500 hover:underline font-medium">
                Inicia Sesión
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right: globe */}
      <div className="hidden lg:block relative w-1/2 bg-gradient-to-br from-emerald-50/30 via-slate-50 to-white overflow-hidden">
        <GlobeCanvas className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
