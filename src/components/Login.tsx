import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthLayout from './AuthLayout';

const loginSchema = z.object({
  username: z.string().trim().min(1, 'El nombre de usuario es requerido'),
  password: z.string().trim().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface Props {
  onToggleForm?: () => void;
  onForgot?: () => void;
}

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
    <AuthLayout title="Inicia sesión en tu cuenta">
      <div className="relative bg-[--bg-card] border border-[--border] rounded-2xl p-8 shadow-sm">
        <h2 className="text-[13px] font-semibold text-[--text-primary] mb-7 tracking-tight">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
              Usuario
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-muted]" />
              <input id="username" type="text" autoComplete="username"
                placeholder="nombre de usuario" {...register('username')}
                className={`w-full rounded-xl border bg-[--bg-card] py-3 pl-10 pr-4 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)] ${errors.username ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[--border]'}`} />
            </div>
            {errors.username && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.username.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
                Contraseña
              </label>
              <button type="button" onClick={onForgot} className="text-[11px] text-[--accent] hover:text-[--accent-hover] transition-colors font-medium">
                ¿Olvidaste?
              </button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-muted]" />
              <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                placeholder="••••••••" {...register('password')}
                className={`w-full rounded-xl border bg-[--bg-card] py-3 pl-10 pr-10 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)] ${errors.password ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]' : 'border-[--border]'}`} />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[--text-muted] hover:text-[--text-secondary] transition-colors"
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
            className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-[--accent] hover:bg-[--accent-hover] py-3 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]">
            {loading ? 'Iniciando sesión…' : 'Iniciar Sesión'}
            {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />}
          </button>
        </form>

        <p className="mt-7 text-center text-[11px] text-[--text-muted]">
          ¿No tienes cuenta?{' '}
          <button onClick={onToggleForm} className="text-[--accent] hover:text-[--accent-hover] font-medium transition-colors">
            Regístrate
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
