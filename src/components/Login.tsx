  import { useState, useEffect, useRef } from 'react';
  import { Lock, Mail, ArrowRight, Eye, EyeOff, User } from 'lucide-react';
  import { useAuth } from '../context/AuthContext';
  import api from '../services/api';
  import { useForm } from 'react-hook-form';
  import { z } from 'zod';
  import { zodResolver } from '@hookform/resolvers/zod';
  import * as THREE from 'three';
  import cobeTextureUrl from '../assets/cobe-texture.png';
import GlobeCanvas from './ui/GlobeCanvas';
  // ─── Validation ───────────────────────────────────────────────────────────────

  const loginSchema = z.object({
    username: z.string().min(1, 'El nombre de usuario es requerido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  });

  type LoginForm = z.infer<typeof loginSchema>;

  interface Props {
    onToggleForm?: () => void;
  }

  // ─── Login page ───────────────────────────────────────────────────────────────

  export default function Login({ onToggleForm }: Props) {
    const [error, setError]               = useState<string | null>(null);
    const [loading, setLoading]           = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

    const onSubmit = async (data: LoginForm) => {
      setError(null);
      setLoading(true);
      try {
        const response = await api.post('/api/v1/auth/token', {
          username: data.username,
          password: data.password,
        });
        const token = response.data.accessToken;
        if (token) {
          login(token);
        } else {
          setError('Respuesta inesperada del servidor.');
        }
      } catch (err: unknown) {
        console.error('Error logging in', err);
        setError('Credenciales inválidas o error de conexión.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="relative min-h-screen bg-[#060c18] overflow-hidden">

        {/* Skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-500 focus:text-white focus:rounded-lg"
        >
          Saltar al contenido principal
        </a>

        {/* Globe — WebGL full-screen background */}
        <GlobeCanvas/>

        {/* Brand */}
        <div className="absolute top-18 left-10 z-20">
          <span className="font-['Space_Grotesk',sans-serif] text-xl font-semibold tracking-tight text-white">
            ETL<span className="text-sky-400">.</span>Automate
          </span>
        </div>

        {/* Page layout — card docked to the right */}
        <div
          id="main-content"
          role="main"
          className="relative z-10 flex min-h-screen items-center justify-end px-4 sm:px-8 lg:pr-24 xl:pr-32"
        >
          <div
            className="w-full max-w-sm"
            style={{ animation: 'fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) both' }}
          >
            <div
              className="rounded-2xl border p-8"
              style={{
                background:           'rgba(10,16,35,0.72)',
                backdropFilter:       'blur(28px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
                borderColor:          'rgba(56,189,248,0.15)',
                boxShadow:
                  '0 0 0 1px rgba(255,255,255,0.04) inset, 0 40px 80px rgba(0,0,0,0.5)',
              }}
            >
              {/* Header */}
              <p className="mb-1 text-[11px] font-medium uppercase tracking-widest text-sky-400">
                Bienvenido
              </p>
              <h1 className="mb-7 font-['Space_Grotesk',sans-serif] text-[1.6rem] font-semibold -tracking-tight text-white">
                Iniciar Sesión
              </h1>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-1.5 block text-[12px] font-medium tracking-wide text-slate-400"
                  >
                    Nombre de usuario
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-slate-600"
                      aria-hidden="true"
                    />
                    <input
                      id="username"
                      type="text"
                      autoComplete="username"
                      aria-invalid={errors.username ? 'true' : 'false'}
                      aria-describedby={errors.username ? 'username-error' : undefined}
                      placeholder="nombre de usuario"
                      {...register('username')}
                      className="w-full rounded-[10px] border py-[10px] pl-10 pr-4 text-[14px] text-slate-200 placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-sky-500/50"
                      style={{
                        background:  'rgba(255,255,255,0.05)',
                        borderColor: errors.username
                          ? 'rgba(248,113,113,0.5)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </div>
                  {errors.username && (
                    <p id="username-error" role="alert" className="mt-1 text-[11px] text-red-400">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-[12px] font-medium tracking-wide text-slate-400"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-slate-600"
                      aria-hidden="true"
                    />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      aria-invalid={errors.password ? 'true' : 'false'}
                      aria-describedby={errors.password ? 'pw-error' : undefined}
                      placeholder="••••••••"
                      {...register('password')}
                      className="w-full rounded-[10px] border py-[10px] pl-10 pr-11 text-[14px] text-slate-200 placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-sky-500/50"
                      style={{
                        background:  'rgba(255,255,255,0.05)',
                        borderColor: errors.password
                          ? 'rgba(248,113,113,0.5)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-500 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword
                        ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                        : <Eye    className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="pw-error" role="alert" className="mt-1 text-[11px] text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Server error */}
                {error && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-[13px] text-red-400"
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-[10px] py-[11px] text-[14px] font-semibold text-white transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
                >
                  <span
                    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)' }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10">
                    {loading ? 'Iniciando sesión…' : 'Iniciar Sesión'}
                  </span>
                  {!loading && (
                    <ArrowRight
                      className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="mt-6 text-center text-[12px] text-slate-600">
                ¿No tienes cuenta?{' '}
                <button
                  onClick={onToggleForm}
                  className="text-sky-400 hover:text-sky-300 hover:underline focus:outline-none focus:ring-2 focus:ring-sky-500 rounded"
                >
                  Regístrate
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Keyframes */}
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; transition: none !important; }
          }
        `}</style>
      </div>
    );
  }