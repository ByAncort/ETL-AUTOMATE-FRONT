import { useState, useEffect, useRef } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ─── Validation ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'El nombre de usuario es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface Props {
  onToggleForm?: () => void;
}

// ─── Globe data ───────────────────────────────────────────────────────────────

const GLOBE_POINTS = [
  { lat: 22.3193, lng: 114.1694 }, { lat: 28.6139, lng: 77.209 },
  { lat: -1.3034, lng: 36.8524 },  { lat: 35.6762, lng: 139.6503 },
  { lat: 51.5072, lng: -0.1276 },  { lat: 36.1628, lng: -115.1194 },
  { lat: -33.8688, lng: 151.2093 },{ lat: 21.3099, lng: -157.8581 },
  { lat: -6.2088, lng: 106.8456 }, { lat: 11.9866, lng: 8.5718 },
  { lat: -34.6037, lng: -58.3816 },{ lat: 48.8566, lng: 2.3522 },
  { lat: 14.5995, lng: 120.9842 }, { lat: 34.0522, lng: -118.2437 },
  { lat: 37.5665, lng: 126.978 },  { lat: 41.9028, lng: 12.4964 },
  { lat: 31.2304, lng: 121.4737 }, { lat: 49.2827, lng: -123.1207 },
  { lat: 52.52, lng: 13.405 },     { lat: -22.9068, lng: -43.1729 },
];

const ARC_DATA = [
  { s: [22.3193, 114.1694],  e: [-33.8688, 151.2093] },
  { s: [28.6139, 77.209],    e: [51.5072, -0.1276]   },
  { s: [-33.8688, 151.2093], e: [34.0522, -118.2437]  },
  { s: [51.5072, -0.1276],   e: [14.5995, 120.9842]  },
  { s: [-15.4326, 28.3159],  e: [36.1628, -115.1194] },
  { s: [21.3099, -157.8581], e: [40.7128, -74.006]   },
  { s: [11.9866, 8.5718],    e: [-22.9068, -43.1729] },
  { s: [-34.6037, -58.3816], e: [22.3193, 114.1694]  },
  { s: [14.5995, 120.9842],  e: [51.5072, -0.1276]   },
  { s: [34.0522, -118.2437], e: [48.8566, 2.3522]    },
  { s: [37.5665, 126.978],   e: [35.6762, 139.6503]  },
  { s: [52.52, 13.405],      e: [34.0522, -118.2437] },
  { s: [49.2827, -123.1207], e: [52.52, 13.405]      },
  { s: [22.3193, 114.1694],  e: [-22.9068, -43.1729] },
  { s: [-22.9068, -43.1729], e: [28.6139, 77.209]    },
  { s: [31.2304, 121.4737],  e: [34.0522, -118.2437] },
  { s: [41.9028, 12.4964],   e: [48.8566, 2.3522]    },
];

const ARC_COLORS = ['#38bdf8', '#818cf8', '#6366f1', '#06b6d4', '#a78bfa'];
const DOT_COLORS = ['#38bdf8', '#818cf8', '#34d399'];

function hexToRgb(hex: string) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

// ─── Globe canvas ─────────────────────────────────────────────────────────────

function GlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const arcs = ARC_DATA.map((a, i) => ({
      ...a,
      progress: Math.random(),
      color: ARC_COLORS[i % ARC_COLORS.length],
    }));

    function latLng(lat: number, lng: number, r: number) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return {
        x: -r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
      };
    }

    function rotateY(
      p: { x: number; y: number; z: number },
      rot: number
    ) {
      const c = Math.cos(rot), s = Math.sin(rot);
      return { x: p.x * c - p.z * s, y: p.y, z: p.x * s + p.z * c };
    }

    let time = 0;

const draw = () => {
  if (!prefersReduced) time += 0.002;

  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R = Math.min(W, H) * 0.38;
  const rot = time * 0.28;

  ctx.clearRect(0, 0, W, H);

  // Ambient halo
  const halo = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 2.4);
  halo.addColorStop(0, 'rgba(6,24,60,0.55)');
  halo.addColorStop(0.5, 'rgba(6,20,45,0.18)');
  halo.addColorStop(1, 'transparent');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'rgba(56,189,248,0.1)';
  for (let lat = -75; lat <= 75; lat += 15) {
    const r2 = R * Math.cos((lat * Math.PI) / 180);
    const yOff = R * Math.sin((lat * Math.PI) / 180);
    ctx.beginPath();
    ctx.ellipse(cx, cy + yOff, r2, r2 * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let lon = 0; lon < 360; lon += 20) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R * 0.22, (lon * Math.PI) / 180, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Globe base
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(4,8,22,0.82)';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(56,189,248,0.18)';
  ctx.stroke();

  // Arcs
  if (!prefersReduced) {
    arcs.forEach((arc) => {
      const s3 = rotateY(latLng(arc.s[0], arc.s[1], R), rot);
      const e3 = rotateY(latLng(arc.e[0], arc.e[1], R), rot);
      const ss = 1 + s3.z / (R * 1.5);
      const es = 1 + e3.z / (R * 1.5);
      const sx = cx + s3.x * ss, sy = cy + s3.y * ss;
      const ex = cx + e3.x * es, ey = cy + e3.y * es;
      const p = (arc.progress + time * 0.38) % 1;
      const mx = (sx + ex) / 2;
      const my = (sy + ey) / 2 - R * 0.45 * Math.sin(p * Math.PI);
      const alpha = Math.sin(p * Math.PI) * 0.85;
      const { r, g, b } = hexToRgb(arc.color);
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(mx, my, ex, ey);
      ctx.stroke();
      if (p > 0.05 && p < 0.95) {
        const t = p;
        const px = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * mx + t * t * ex;
        const py = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * my + t * t * ey;
        ctx.beginPath();
        ctx.fillStyle = arc.color;
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
 // City dots
  GLOBE_POINTS.forEach((pt, i) => {
    const p3 = rotateY(latLng(pt.lat, pt.lng, R), rot);
    if (p3.z < -R * 0.5) return;
    const sc = 1 + p3.z / (R * 1.5);
    ctx.globalAlpha = 0.4 + sc * 0.5;
    ctx.beginPath();
    ctx.fillStyle = DOT_COLORS[i % DOT_COLORS.length];
    ctx.arc(cx + p3.x * sc, cy + p3.y * sc, 2.5 * sc, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  // Edge glow
  const edge = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 1.05);
  edge.addColorStop(0, 'transparent');
  edge.addColorStop(1, 'rgba(56,189,248,0.2)');
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
  ctx.fillStyle = edge;
  ctx.fill();

  rafRef.current = requestAnimationFrame(draw);
};

draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}

// ─── Login page ───────────────────────────────────────────────────────────────

export default function Login({ onToggleForm }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
    <div className="relative min-h-screen bg-[var(--bg-primary)] overflow-hidden">

      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-500 focus:text-white focus:rounded-lg"
      >
        Saltar al contenido principal
      </a>

      {/* Globe — full-screen background */}
      <GlobeCanvas />

      {/* Brand */}
      <div className="absolute top-8 left-10 z-20">
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
          className="w-full max-w-sm animate-[fadeUp_0.55s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ animationName: 'fadeUp' }}
        >
          <div
            className="rounded-2xl border p-8"
            style={{
              background: 'rgba(10,16,35,0.72)',
              backdropFilter: 'blur(28px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
              borderColor: 'rgba(56,189,248,0.15)',
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

              {/* Email */}
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-[12px] font-medium tracking-wide text-slate-400"
                >
                  Nombre de usuario
                </label>
                <div className="relative">
                  <Mail
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
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: errors.username
                        ? 'rgba(248,113,113,0.5)'
                        : 'rgba(255,255,255,0.1)',
                    }}
                  />
                </div>
                {errors.username && (
                  <p
                    id="username-error"
                    role="alert"
                    className="mt-1 text-[11px] text-red-400"
                  >
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
                      background: 'rgba(255,255,255,0.05)',
                      borderColor: errors.password
                        ? 'rgba(248,113,113,0.5)'
                        : 'rgba(255,255,255,0.1)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-slate-500 hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" aria-hidden="true" />
                      : <Eye className="h-4 w-4" aria-hidden="true" />}
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
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                }}
              >
                {/* hover overlay */}
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

      {/* Keyframe */}
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