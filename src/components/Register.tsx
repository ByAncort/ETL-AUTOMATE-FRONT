import { useState } from 'react';
import { Lock, User, ArrowRight, Mail, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import GlobeCanvas from './ui/GlobeCanvas';

// ─── Validation ───────────────────────────────────────────────────────────────

const registerSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
});

type RegisterForm = z.infer<typeof registerSchema>;

interface Props {
  onToggleForm: () => void;
}

// ─── Register page ────────────────────────────────────────────────────────────

export default function Register({ onToggleForm }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await api.post('/api/users/register', data);
      setSuccess('Usuario creado exitosamente. Ya puedes iniciar sesión.');
      setTimeout(() => {
        onToggleForm();
      }, 2000);
    } catch (err: unknown) {
      console.error('Error registering', err);
      setError('No se pudo registrar. Quizás el usuario/email ya existe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#060c18] overflow-hidden">

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-white focus:rounded-lg"
      >
        Saltar al contenido principal
      </a>

      {/* Globe — WebGL full-screen background */}
      <GlobeCanvas />

      {/* Brand */}
      <div className="absolute top-18 left-10 z-20">
        <span className="font-['Space_Grotesk',sans-serif] text-xl font-semibold tracking-tight text-white">
          ETL<span className="text-emerald-400">.</span>Automate
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
              background: 'rgba(10,16,35,0.72)',
              backdropFilter: 'blur(28px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
              borderColor: 'rgba(52,211,153,0.15)',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.04) inset, 0 40px 80px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header */}
            <p className="mb-1 text-[11px] font-medium uppercase tracking-widest text-emerald-400">
              Nuevo usuario
            </p>
            <h1 className="mb-7 font-['Space_Grotesk',sans-serif] text-[1.6rem] font-semibold -tracking-tight text-white">
              Crear Cuenta
            </h1>

            {success ? (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-3 text-[13px] text-emerald-400 text-center">
                {success}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                {/* Username */}
                <div>
                  <label
                    htmlFor="reg-username"
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
                      id="reg-username"
                      type="text"
                      autoComplete="username"
                      aria-invalid={errors.username ? 'true' : 'false'}
                      aria-describedby={errors.username ? 'reg-username-error' : undefined}
                      placeholder="nombre de usuario"
                      {...register('username')}
                      className="w-full rounded-[10px] border py-[10px] pl-10 pr-4 text-[14px] text-slate-200 placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: errors.username
                          ? 'rgba(248,113,113,0.5)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </div>
                  {errors.username && (
                    <p id="reg-username-error" role="alert" className="mt-1 text-[11px] text-red-400">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="reg-firstname"
                      className="mb-1.5 block text-[12px] font-medium tracking-wide text-slate-400"
                    >
                      Nombre
                    </label>
                    <input
                      id="reg-firstname"
                      type="text"
                      autoComplete="given-name"
                      aria-invalid={errors.firstName ? 'true' : 'false'}
                      aria-describedby={errors.firstName ? 'reg-firstname-error' : undefined}
                      placeholder="Nombre"
                      {...register('firstName')}
                      className="w-full rounded-[10px] border py-[10px] px-4 text-[14px] text-slate-200 placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: errors.firstName
                          ? 'rgba(248,113,113,0.5)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                    {errors.firstName && (
                      <p id="reg-firstname-error" role="alert" className="mt-1 text-[11px] text-red-400">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="reg-lastname"
                      className="mb-1.5 block text-[12px] font-medium tracking-wide text-slate-400"
                    >
                      Apellido
                    </label>
                    <input
                      id="reg-lastname"
                      type="text"
                      autoComplete="family-name"
                      aria-invalid={errors.lastName ? 'true' : 'false'}
                      aria-describedby={errors.lastName ? 'reg-lastname-error' : undefined}
                      placeholder="Apellido"
                      {...register('lastName')}
                      className="w-full rounded-[10px] border py-[10px] px-4 text-[14px] text-slate-200 placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: errors.lastName
                          ? 'rgba(248,113,113,0.5)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                    {errors.lastName && (
                      <p id="reg-lastname-error" role="alert" className="mt-1 text-[11px] text-red-400">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="reg-email"
                    className="mb-1.5 block text-[12px] font-medium tracking-wide text-slate-400"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-slate-600"
                      aria-hidden="true"
                    />
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'reg-email-error' : undefined}
                      placeholder="email@ejemplo.com"
                      {...register('email')}
                      className="w-full rounded-[10px] border py-[10px] pl-10 pr-4 text-[14px] text-slate-200 placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: errors.email
                          ? 'rgba(248,113,113,0.5)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </div>
                  {errors.email && (
                    <p id="reg-email-error" role="alert" className="mt-1 text-[11px] text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="reg-password"
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
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      aria-invalid={errors.password ? 'true' : 'false'}
                      aria-describedby={errors.password ? 'reg-pw-error' : undefined}
                      placeholder="••••••••"
                      {...register('password')}
                      className="w-full rounded-[10px] border py-[10px] pl-10 pr-11 text-[14px] text-slate-200 placeholder-slate-600 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: errors.password
                          ? 'rgba(248,113,113,0.5)'
                          : 'rgba(255,255,255,0.1)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-500 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword
                        ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                        : <Eye className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p id="reg-pw-error" role="alert" className="mt-1 text-[11px] text-red-400">
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
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  <span
                    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ background: 'linear-gradient(135deg, #34d399, #10b981)' }}
                    aria-hidden="true"
                  />
                  <span className="relative z-10">
                    {loading ? 'Creando cuenta…' : 'Crear Cuenta'}
                  </span>
                  {!loading && (
                    <ArrowRight
                      className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </form>
            )}

            {/* Footer */}
            <p className="mt-6 text-center text-[12px] text-slate-600">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={onToggleForm}
                className="text-emerald-400 hover:text-emerald-300 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
              >
                Inicia Sesión
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