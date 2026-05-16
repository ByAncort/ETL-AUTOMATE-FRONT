import { useState } from 'react';
import { Lock, ArrowRight, Eye, EyeOff, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import GlobeCanvas from './ui/GlobeCanvas';

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

  const inputClass = "w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/90 border-slate-200/80";
  const labelClass = "mb-1.5 block text-xs font-medium text-slate-700";

  return (
    <div className="relative min-h-screen flex">
      {/* Left: card */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-600/25">
              <Zap size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">ETL Automate</h1>
            <p className="text-sm text-slate-600 mt-1">Plataforma de Integración de Datos</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl p-8 shadow-xl shadow-slate-200/50">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-blue-600">Bienvenido</p>
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Iniciar Sesión</h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div>
                <label htmlFor="username" className={labelClass}>Nombre de usuario</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input id="username" type="text" autoComplete="username"
                    placeholder="nombre de usuario" {...register('username')}
                    className={`${inputClass} ${errors.username ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} />
                </div>
                {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-medium text-slate-700">Contraseña</label>
                  <button type="button" onClick={onForgot} className="text-xs text-blue-600 hover:text-blue-500 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password"
                    placeholder="••••••••" {...register('password')}
                    className={`${inputClass} ${errors.password ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>

              {error && <div className="rounded-lg border border-red-200 bg-red-50/90 px-3 py-2.5 text-xs text-red-600 backdrop-blur-sm">{error}</div>}

              <button type="submit" disabled={loading}
                className="group relative w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60 shadow-lg shadow-blue-600/25">
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              ¿No tienes cuenta?{' '}
              <button onClick={onToggleForm} className="text-blue-600 hover:text-blue-500 hover:underline font-medium">
                Regístrate
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right: globe */}
      <div className="hidden lg:block relative w-1/2  overflow-hidden">
        <GlobeCanvas className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
