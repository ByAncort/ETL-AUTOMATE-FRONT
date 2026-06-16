import { useState } from 'react';
import { Lock, User, ArrowRight, Mail, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from './AuthLayout';

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

  const { register, handleSubmit, resetField, setFocus, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setError(null); setSuccess(null); setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = data;
      await api.post('/api/users/register', payload);
      setSuccess('Usuario creado exitosamente. Tu cuenta está pendiente de ser activada por un administrador. Redirigiendo...');
      setTimeout(() => onToggleForm(), 4000);
    } catch {
      setError('No se pudo registrar. Quizás el usuario/email ya existe.');
      resetField('username'); setFocus('username'); // limpiar Usuario tras intento fallido
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Crea una cuenta en la plataforma">
      <div className="relative bg-[--bg-card] border border-[--border] rounded-2xl p-8 shadow-sm">
        <h2 className="text-[13px] font-semibold text-[--text-primary] mb-7 tracking-tight">
          Crear Cuenta
        </h2>

        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-[11px] text-emerald-700 text-center font-medium">{success}</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label htmlFor="reg-username" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
                Usuario
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-muted]" />
                <input id="reg-username" type="text" autoComplete="username" placeholder="usuario" {...register('username')}
                  className={`w-full rounded-xl border bg-[--bg-card] py-3 pl-10 pr-4 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)] ${errors.username ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[--border]'}`} />
              </div>
              {errors.username && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.username.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-firstname" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
                  Nombre
                </label>
                <input id="reg-firstname" type="text" autoComplete="given-name" placeholder="Nombre" {...register('firstName')}
                  className={`w-full rounded-xl border bg-[--bg-card] py-3 px-4 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)] ${errors.firstName ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[--border]'}`} />
                {errors.firstName && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.firstName.message}</p>}
              </div>
              <div>
                <label htmlFor="reg-lastname" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
                  Apellido
                </label>
                <input id="reg-lastname" type="text" autoComplete="family-name" placeholder="Apellido" {...register('lastName')}
                  className={`w-full rounded-xl border bg-[--bg-card] py-3 px-4 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)] ${errors.lastName ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[--border]'}`} />
                {errors.lastName && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-muted]" />
                <input id="reg-email" type="email" autoComplete="email" placeholder="email@ejemplo.com" {...register('email')}
                  className={`w-full rounded-xl border bg-[--bg-card] py-3 pl-10 pr-4 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)] ${errors.email ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[--border]'}`} />
              </div>
              {errors.email && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-password" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-muted]" />
                <input id="reg-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="••••••••" {...register('password')}
                  className={`w-full rounded-xl border bg-[--bg-card] py-3 pl-10 pr-10 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)] ${errors.password ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[--border]'}`} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text-secondary] transition-colors"
                  aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label htmlFor="reg-confirm-password" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-muted]" />
                <input id="reg-confirm-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="••••••••" {...register('confirmPassword')}
                  className={`w-full rounded-xl border bg-[--bg-card] py-3 pl-10 pr-10 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)] ${errors.confirmPassword ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[--border]'}`} />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-[11px] text-red-600 font-medium">{error}</div>}

            <button type="submit" disabled={loading}
              className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-[--accent] hover:bg-[--accent-hover] py-3 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]">
              {loading ? 'Creando cuenta…' : 'Crear Cuenta'}
              {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>
        )}

        <p className="mt-7 text-center text-[11px] text-[--text-muted]">
          ¿Ya tienes cuenta?{' '}
          <button onClick={onToggleForm} className="text-[--accent] hover:text-[--accent-hover] font-medium transition-colors">
            Inicia Sesión
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
