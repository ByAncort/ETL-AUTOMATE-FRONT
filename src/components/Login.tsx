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
  { lat: -1.3034, lng: 36.8524 }, { lat: 35.6762, lng: 139.6503 },
  { lat: 51.5072, lng: -0.1276 }, { lat: 36.1628, lng: -115.1194 },
  { lat: -33.8688, lng: 151.2093 }, { lat: 21.3099, lng: -157.8581 },
  { lat: -6.2088, lng: 106.8456 }, { lat: 11.9866, lng: 8.5718 },
  { lat: -34.6037, lng: -58.3816 }, { lat: 48.8566, lng: 2.3522 },
  { lat: 14.5995, lng: 120.9842 }, { lat: 34.0522, lng: -118.2437 },
  { lat: 37.5665, lng: 126.978 }, { lat: 41.9028, lng: 12.4964 },
  { lat: 31.2304, lng: 121.4737 }, { lat: 49.2827, lng: -123.1207 },
  { lat: 52.52, lng: 13.405 }, { lat: -22.9068, lng: -43.1729 },
];

const ARC_DATA = [
  { s: [22.3193, 114.1694], e: [-33.8688, 151.2093] },
  { s: [28.6139, 77.209], e: [51.5072, -0.1276] },
  { s: [-33.8688, 151.2093], e: [34.0522, -118.2437] },
  { s: [51.5072, -0.1276], e: [14.5995, 120.9842] },
  { s: [-15.4326, 28.3159], e: [36.1628, -115.1194] },
  { s: [21.3099, -157.8581], e: [40.7128, -74.006] },
  { s: [11.9866, 8.5718], e: [-22.9068, -43.1729] },
  { s: [-34.6037, -58.3816], e: [22.3193, 114.1694] },
  { s: [14.5995, 120.9842], e: [51.5072, -0.1276] },
  { s: [34.0522, -118.2437], e: [48.8566, 2.3522] },
  { s: [37.5665, 126.978], e: [35.6762, 139.6503] },
  { s: [52.52, 13.405], e: [34.0522, -118.2437] },
  { s: [49.2827, -123.1207], e: [52.52, 13.405] },
  { s: [22.3193, 114.1694], e: [-22.9068, -43.1729] },
  { s: [-22.9068, -43.1729], e: [28.6139, 77.209] },
  { s: [31.2304, 121.4737], e: [34.0522, -118.2437] },
  { s: [41.9028, 12.4964], e: [48.8566, 2.3522] },
];

const ARC_COLORS = ['#38bdf8', '#818cf8', '#6366f1', '#06b6d4', '#a78bfa'];
const DOT_COLORS = ['#38bdf8', '#818cf8', '#34d399'];

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}
const CONTINENT_DOTS: [number, number][] = [
  // ── Norteamérica (costa oeste → este, aprox.) ────────
  [65, -168], [64, -162], [62, -156], [60, -150], [58, -144],
  [56, -138], [54, -134], [50, -128], [46, -124], [42, -124],
  [38, -123], [34, -120], [30, -116], [26, -112], [22, -110],
  [18, -105], [20, -98], [22, -92], [26, -86], [28, -82],
  [30, -80], [32, -78], [34, -76], [36, -75], [38, -74],
  [40, -73], [42, -70], [44, -68], [46, -64], [48, -60],
  [50, -56], [52, -54], [54, -56], [56, -58], [58, -60],
  [60, -64], [62, -68], [64, -72], [66, -76], [68, -84],
  [70, -92], [72, -104], [72, -120], [70, -140], [68, -156],
  [66, -164],
  // Interior NA
  [62, -150], [60, -140], [58, -130], [55, -120], [52, -110],
  [50, -100], [48, -95], [46, -90], [44, -85], [42, -82],
  [40, -85], [38, -90], [36, -95], [34, -100], [32, -105],
  [30, -110], [35, -108], [38, -100], [42, -95], [46, -95],
  [50, -92], [55, -100], [58, -105], [60, -110], [62, -120],

  // ── Sudamérica ───────────────────────────────────────
  [12, -72], [10, -75], [8, -77], [6, -77], [4, -77],
  [2, -76], [0, -76], [-2, -76], [-4, -76], [-6, -76],
  [-8, -77], [-10, -77], [-12, -77], [-14, -76], [-16, -74],
  [-18, -72], [-20, -70], [-22, -68], [-24, -66], [-26, -64],
  [-28, -62], [-30, -58], [-32, -54], [-34, -56], [-34, -58],
  [-32, -60], [-30, -62], [-28, -64], [-26, -66], [-24, -68],
  [-22, -70], [-20, -72], [-18, -74], [-16, -76], [-14, -76],
  [-12, -74], [-10, -72], [-8, -70], [-6, -68], [-4, -66],
  [-2, -64], [0, -62], [2, -60], [4, -58], [6, -56],
  [8, -54], [10, -56], [12, -60], [10, -65],
  // Interior SA
  [8, -65], [5, -60], [0, -55], [-5, -50], [-10, -48],
  [-15, -48], [-20, -50], [-25, -52], [-28, -55], [-30, -58],
  [-25, -58], [-20, -58], [-15, -56], [-10, -55], [-5, -56],
  [0, -60], [5, -62],

  // ── Europa ───────────────────────────────────────────
  [36, -5], [37, -1], [38, 0], [39, 2], [40, 3],
  [41, 6], [42, 8], [43, 10], [44, 12], [45, 14],
  [46, 18], [46, 22], [46, 26], [46, 30], [45, 34],
  [44, 38], [42, 40], [40, 38], [38, 36], [36, 34],
  [36, 30], [35, 26], [36, 22], [36, 18], [37, 14],
  [36, 10], [36, 6], [36, 2], [36, -2],
  // Interior EU
  [42, 2], [44, 8], [46, 12], [48, 10], [50, 8],
  [52, 6], [54, 10], [52, 14], [50, 16], [48, 18],
  [46, 20], [44, 22], [42, 24], [40, 22], [42, 18],
  [44, 14], [46, 10], [44, 6], [42, 4],

  // ── África ───────────────────────────────────────────
  [36, -2], [34, -4], [32, -8], [30, -10], [28, -12],
  [26, -14], [24, -16], [22, -16], [20, -16], [18, -16],
  [16, -16], [14, -16], [12, -16], [10, -14], [8, -12],
  [6, -10], [4, -8], [2, -6], [0, 6], [-2, 14],
  [-4, 22], [-6, 30], [-8, 36], [-10, 40], [-12, 42],
  [-14, 42], [-16, 40], [-18, 36], [-20, 32], [-22, 28],
  [-24, 24], [-26, 20], [-28, 16], [-30, 14], [-32, 16],
  [-34, 18], [-34, 20], [-32, 20], [-30, 22], [-30, 24],
  [-28, 26], [-26, 28], [-24, 28], [-22, 30], [-20, 32],
  [-18, 34], [-16, 36], [-14, 38], [-12, 42], [-10, 44],
  [-8, 46], [-6, 48], [-4, 50], [0, 50], [2, 50],
  [4, 48], [6, 46], [8, 44], [10, 42], [12, 44],
  [14, 42], [16, 40], [18, 36], [20, 32], [22, 28],
  [24, 24], [26, 20], [28, 16], [30, 14], [32, 14],
  [34, 10], [36, 6], [36, 2],
  // Interior AF
  [30, 0], [25, 0], [20, 5], [15, 10], [10, 15],
  [5, 20], [0, 25], [-5, 28], [-10, 30], [-15, 28],
  [-20, 25], [-25, 22], [-28, 20], [-28, 24], [-22, 28],
  [-16, 30], [-10, 30], [-4, 28], [2, 24], [8, 20],
  [14, 16], [20, 10], [26, 5], [30, 5],

  // ── Asia ────────────────────────────────────────────
  [42, 42], [44, 44], [46, 48], [46, 54], [48, 60],
  [50, 68], [54, 72], [56, 80], [58, 88], [60, 100],
  [62, 120], [64, 140], [66, 160], [68, 180], [66, -170],
  [64, -165], [62, -162], [60, -160], [56, -162], [54, -160],
  [50, -155], [48, -150], [44, -145], [42, -140], [38, -136],
  [36, -130], [34, -128], [32, -126], [30, -124], [28, -120],
  [26, -118], [24, -116], [22, -114], [20, -110], [18, -106],
  [16, -100], [14, -94], [12, -88], [10, -82], [8, -78],
  [6, -74], [4, -72], [2, -68], [0, -64], [-2, -60],
  [-4, -56], [-6, -50], [-8, -46], [-4, -42], [0, -38],
  [4, -36], [8, -34], [12, -32], [16, -28], [20, -24],
  [24, -22], [28, -20], [32, -18], [36, -14], [38, -10],
  [40, -6], [42, -2], [42, 6], [44, 14], [44, 22],
  [44, 30], [44, 38],
  // Interior AS
  [50, 50], [54, 60], [58, 70], [60, 80], [62, 90],
  [62, 100], [60, 110], [58, 115], [54, 110], [50, 100],
  [48, 90], [46, 80], [44, 70], [42, 60], [40, 50],
  [38, 38], [40, 40], [44, 46], [48, 52], [52, 58],
  [56, 64], [58, 60], [56, 54], [52, 48], [48, 44],
  [44, 42], [46, 50], [50, 56], [54, 62], [52, 60],

  // ── Oceanía / Australia ─────────────────────────────
  [-12, 130], [-14, 128], [-16, 126], [-18, 124], [-20, 122],
  [-22, 124], [-24, 128], [-26, 132], [-28, 136], [-30, 140],
  [-32, 144], [-34, 146], [-36, 146], [-38, 144], [-38, 140],
  [-36, 138], [-34, 136], [-32, 134], [-30, 132], [-28, 130],
  [-26, 128], [-24, 126], [-22, 124], [-20, 122], [-18, 124],
  [-16, 126], [-14, 128], [-12, 130],
  // Interior AU
  [-18, 130], [-22, 130], [-24, 132], [-26, 134], [-28, 136],
  [-30, 138], [-32, 140], [-33, 142], [-30, 142], [-28, 140],
  [-26, 138], [-24, 136], [-22, 134], [-20, 132], [-18, 132],

  // ── Japón / Islas ───────────────────────────────────
  [42, 140], [40, 140], [38, 140], [36, 138], [34, 136],
  [32, 134], [30, 132], [32, 132], [34, 134], [36, 136],
  [38, 138], [40, 138],

  // ── UK / Irlanda ────────────────────────────────────
  [50, -6], [52, -4], [54, -2], [56, -2], [58, -4],
  [56, -6], [54, -6], [52, -6], [50, -6],

  // ── Madagascar ──────────────────────────────────────
  [-12, 48], [-14, 48], [-16, 48], [-18, 48], [-20, 46],
  [-22, 44], [-24, 44], [-26, 44], [-24, 46], [-22, 46],
  [-20, 46], [-18, 48], [-16, 48], [-14, 48],

  // ── Nueva Zelanda ───────────────────────────────────
  [-34, 172], [-36, 174], [-38, 176], [-40, 174], [-42, 172],
  [-42, 170], [-40, 168], [-38, 170], [-36, 170],
  [-44, 168], [-46, 168], [-46, 166], [-44, 166],
];

// ─── Globe canvas ─────────────────────────────────────────────────────────────
interface GlobeCanvasProps {
  continentDots?: [number, number][];
}

function GlobeCanvas({ continentDots }: GlobeCanvasProps) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dots = continentDots ?? [];
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
      progress: Math.random(), // fase inicial del dot viajero
      color: ARC_COLORS[i % ARC_COLORS.length],
      arcHeight: 0.35 + Math.random() * 0.3, // altura fija del arco (0.35–0.65)
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
      const c = Math.cos(rot),
        s = Math.sin(rot);
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
      ctx.strokeStyle = 'rgba(56,189,248,0.12)';
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
      ctx.fillStyle = 'rgba(4,8,22,0.88)';
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(56,189,248,0.2)';
      ctx.stroke();

      CONTINENT_DOTS.forEach(([lat, lng]) => {
        const p3 = rotateY(latLng(lat, lng, R), rot);
        // Ocultar puntos en la cara trasera del globo
        if (p3.z < -R * 0.55) return;
        const sc = 1 + p3.z / (R * 1.5);
        const alpha = 0.18 + sc * 0.55;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.fillStyle = '#38bdf8';
        ctx.arc(cx + p3.x * sc, cy + p3.y * sc, 1.3 * sc, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      // Arcs
      if (!prefersReduced) {
        arcs.forEach((arc) => {
          const s3 = rotateY(latLng(arc.s[0], arc.s[1], R), rot);
          const e3 = rotateY(latLng(arc.e[0], arc.e[1], R), rot);

          // Proyección con profundidad
          const ss = 1 + s3.z / (R * 1.5);
          const es = 1 + e3.z / (R * 1.5);
          const sx = cx + s3.x * ss,
            sy = cy + s3.y * ss;
          const ex = cx + e3.x * es,
            ey = cy + e3.y * es;

          // Punto medio en 2D
          const midX = (sx + ex) / 2;
          const midY = (sy + ey) / 2;

          // Vector perpendicular para curvar el arco hacia afuera
          const dx = ex - sx;
          const dy = ey - sy;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const perpX = -dy / len;
          const perpY = dx / len;

          // Altura fija del arco (no pulsa con el tiempo)
          const arcOffset = R * arc.arcHeight;

          // Control point del arco (estable)
          const mx = midX + perpX * arcOffset;
          const my = midY + perpY * arcOffset;

          // Progress del dot viajero (avanza con el tiempo)
          const p = (arc.progress + time * 0.38) % 1;

          // Alpha del arco (más intenso cuando el dot está visible)
          const arcAlpha = 0.35 + Math.sin(p * Math.PI) * 0.45;

          const { r, g, b } = hexToRgb(arc.color);

          // Dibujar el arco
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r},${g},${b},${arcAlpha})`;
          ctx.lineWidth = 1.3;
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(mx, my, ex, ey);
          ctx.stroke();

          // Dot viajero sobre la curva cuadrática
          if (p > 0.03 && p < 0.97) {
            const t = p;
            const oneMinusT = 1 - t;
            const px =
              oneMinusT * oneMinusT * sx + 2 * oneMinusT * t * mx + t * t * ex;
            const py =
              oneMinusT * oneMinusT * sy + 2 * oneMinusT * t * my + t * t * ey;
            ctx.beginPath();
            ctx.fillStyle = arc.color;
            ctx.shadowColor = arc.color;
            ctx.shadowBlur = 6;
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      }
      // City dots
      GLOBE_POINTS.forEach((pt, i) => {
        const p3 = rotateY(latLng(pt.lat, pt.lng, R), rot);
        if (p3.z < -R * 0.5) return;
        const sc = 1 + p3.z / (R * 1.5);
        ctx.globalAlpha = 0.45 + sc * 0.5;
        ctx.beginPath();
        ctx.fillStyle = DOT_COLORS[i % DOT_COLORS.length];
        ctx.arc(cx + p3.x * sc, cy + p3.y * sc, 2.8 * sc, 0, Math.PI * 2);
        ctx.fill();
        // Brillo alrededor
        ctx.globalAlpha = 0.15 + sc * 0.2;
        ctx.beginPath();
        ctx.fillStyle = DOT_COLORS[i % DOT_COLORS.length];
        ctx.arc(cx + p3.x * sc, cy + p3.y * sc, 5 * sc, 0, Math.PI * 2);
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