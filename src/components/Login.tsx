import { useState, useEffect, useRef } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as THREE from 'three';
import cobeTextureUrl from '../assets/cobe-texture.png';
// ─── Validation ───────────────────────────────────────────────────────────────

const loginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface Props {
  onToggleForm?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GLOBE_RADIUS  = 150;
const DEG2RAD       = Math.PI / 180;
const DOT_DENSITY   = 9;        // dots per unit of circumference
const DOT_ROWS      = 180;
const DOT_SIZE      = 1;
const DOT_SEGMENTS  = 5;
const ROTATION_SPEED = 0.0006;  // rad/frame

// Arc data: [fromLat, fromLng, toLat, toLng]
const ARC_DATA: [number, number, number, number][] = [
  [ 22.32,  114.17, -33.87,  151.21],  // HK → Sydney
  [ 28.61,   77.21,  51.51,   -0.13],  // Delhi → London
  [-33.87,  151.21,  34.05, -118.24],  // Sydney → LA
  [ 51.51,   -0.13,  14.60,  120.98],  // London → Manila
  [ 21.31, -157.86,  40.71,  -74.01],  // Honolulu → NY
  [-34.60,  -58.38,  22.32,  114.17],  // Buenos Aires → HK
  [ 11.99,    8.57, -22.91,  -43.17],  // Kano → Rio
  [ 37.57,  126.98,  35.68,  139.65],  // Seoul → Tokyo
  [ 52.52,   13.41,  34.05, -118.24],  // Berlin → LA
  [ 48.86,    2.35,  34.05, -118.24],  // Paris → LA
  [ 49.28, -123.12,  52.52,   13.41],  // Vancouver → Berlin
  [ 31.23,  121.47,  34.05, -118.24],  // Shanghai → LA
  [ 41.90,   12.50,  48.86,    2.35],  // Rome → Paris
  [ 14.60,  120.98,  51.51,   -0.13],  // Manila → London
  [-22.91,  -43.17,  28.61,   77.21],  // Rio → Delhi
];

// City markers [lat, lng]
const MARKERS: [number, number][] = [
  [ 22.32,  114.17], [ 28.61,   77.21], [ -1.30,   36.85],
  [ 35.68,  139.65], [ 51.51,   -0.13], [ 36.16, -115.12],
  [-33.87,  151.21], [ 21.31, -157.86], [ -6.21,  106.85],
  [ 11.99,    8.57], [-34.60,  -58.38], [ 48.86,    2.35],
  [ 14.60,  120.98], [ 34.05, -118.24], [ 37.57,  126.98],
  [ 41.90,   12.50], [ 31.23,  121.47], [ 49.28, -123.12],
  [ 52.52,   13.41], [-22.91,  -43.17],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert lat/lng to a point on a sphere of given radius */
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi   = (90 - lat) * DEG2RAD;
  const theta = (lng + 180) * DEG2RAD;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Cubic bezier control points that arc out into space */
function arcControlPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  arcHeightFactor = 0.4,
): [THREE.Vector3, THREE.Vector3] {
  const dist  = start.distanceTo(end);
  const mid   = start.clone().lerp(end, 0.5).normalize();
  const lift  = GLOBE_RADIUS + dist * arcHeightFactor;
  const midOut = mid.multiplyScalar(lift);

  const ctrl1 = start.clone().lerp(midOut, 0.5);
  const ctrl2 = end.clone().lerp(midOut, 0.5);
  return [ctrl1, ctrl2];
}

// ─── Globe Canvas ─────────────────────────────────────────────────────────────

function GlobeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 1, 2000);
    camera.position.set(0, 0, 580);

    // ── Globe group (everything rotates together) ─────────────────────────────
    const globeGroup = new THREE.Group();

    // Timezone-based starting rotation (like GitHub)
    const tzOffset    = new Date().getTimezoneOffset() || 0;
    const tzMaxOffset = 60 * 12;
    globeGroup.rotation.y = Math.PI * (tzOffset / tzMaxOffset);

    scene.add(globeGroup);

    // ── Base sphere (dark) ────────────────────────────────────────────────────
    const baseMesh = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64),
      new THREE.MeshPhongMaterial({
        color:     0x040814,
        shininess: 5,
      }),
    );
    globeGroup.add(baseMesh);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a2a4a, 1.5));

    const sunLight = new THREE.DirectionalLight(0x4488ff, 2.5);
    sunLight.position.set(-400, 300, 300);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x0066ff, 1.2);
    rimLight.position.set(400, -200, -300);
    scene.add(rimLight);

    // ── Halo (GitHub technique: backside of slightly larger sphere) ────────────
    const haloMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      transparent: true,
      uniforms: { c: { value: 0.4 }, p: { value: 4.5 } },
      vertexShader: `
        varying float intensity;
        void main() {
          vec3 vNormal   = normalize(normalMatrix * normal);
          vec3 vNormel   = normalize(vec3(modelViewMatrix * vec4(position, 1.0)));
          intensity      = pow(abs(dot(vNormal, vNormel)), ${4.5});
          gl_Position    = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying float intensity;
        void main() {
          vec3 glow = vec3(0.05, 0.25, 0.65) * intensity;
          gl_FragColor  = vec4(glow, intensity * 0.85);
        }
      `,
    });
    const halo = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64), haloMat);
    halo.scale.multiplyScalar(1.18);
    halo.rotateX(Math.PI * 0.03);
    halo.rotateY(Math.PI * 0.03);
    scene.add(halo); // NOT inside globeGroup — stays static

    // ── Continent dots (GitHub technique: PNG map + getImageData) ─────────────
    // We use an offscreen canvas to sample a simple equirectangular world map
    // drawn as filled polygons via a data URI (avoids network requests).
    // For production, replace this with an actual world map PNG fetch.
    
const buildDots = () => {
  // Creamos un canvas offscreen con las mismas dimensiones que la textura (equirectangular)
  const img = new Image();
  img.crossOrigin = 'anonymous'; // por si la textura está servida con CORS
  img.src = cobeTextureUrl;

  img.onload = () => {
    const offscreen = document.createElement('canvas');
    // Ajusta el tamaño del canvas al de la imagen real (normalmente 2048 × 1024)
    offscreen.width = img.width;
    offscreen.height = img.height;
    const octx = offscreen.getContext('2d')!;

    // Dibujamos la textura tal cual
    octx.drawImage(img, 0, 0);

    const imgData = octx.getImageData(0, 0, offscreen.width, offscreen.height);

    // Función que decide si un píxel es "tierra"
    // Dependiendo de la textura, puede usar el canal alfa (si el océano es transparente)
    // o el brillo (si el océano es oscuro y la tierra clara)
    const isLand = (lat: number, lng: number): boolean => {
      const ix  = Math.round(((lng + 180) / 360) * (offscreen.width - 1));
      const iy  = Math.round(((90 - lat) / 180) * (offscreen.height - 1));
      const idx = (iy * offscreen.width + ix) * 4;
      const r   = imgData.data[idx];
      const g   = imgData.data[idx + 1];
      const b   = imgData.data[idx + 2];
      const a   = imgData.data[idx + 3];

      // Opción A: si el océano es transparente (la textura usa PNG con transparencia)
      const brightness = (r + g + b) / 3;
      return brightness > 40;

      // Opción B: si la tierra es clara y el agua oscura (textura estilo sombreado)
      // const brightness = (r + g + b) / 3;
      // return brightness > 80; // umbral ajustable
    };

    // … el resto del código de construcción de puntos sigue igual …
    const circleGeo = new THREE.CircleGeometry(DOT_SIZE, DOT_SEGMENTS);
    const matrices: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();

    for (let lat = -90; lat <= 90; lat += 180 / DOT_ROWS) {
      const radius = Math.cos(Math.abs(lat) * DEG2RAD) * GLOBE_RADIUS;
      const circumference = radius * Math.PI * 2;
      const dotsForLat = Math.round(circumference * DOT_DENSITY * 0.018);

      for (let x = 0; x < dotsForLat; x++) {
        const lng = -180 + (x * 360) / dotsForLat;
        if (!isLand(lat, lng)) continue;

        const pos = latLngToVec3(lat, lng, GLOBE_RADIUS + 0.3);
        dummy.position.copy(pos);
        dummy.lookAt(pos.clone().multiplyScalar(2));
        dummy.updateMatrix();
        matrices.push(dummy.matrix.clone());
      }
    }

    // Elimina la malla de puntos anterior si existe (para evitar duplicados)
    const existingDots = globeGroup.children.find(
      (c) => c instanceof THREE.InstancedMesh && c.material.color.getHex() === 0x1e88e5
    );
    if (existingDots) globeGroup.remove(existingDots);

    const dotMesh = new THREE.InstancedMesh(
      circleGeo,
      new THREE.MeshBasicMaterial({ color: 0x1e88e5, transparent: true, opacity: 0.75 }),
      matrices.length,
    );
    matrices.forEach((m, i) => dotMesh.setMatrixAt(i, m));
    dotMesh.instanceMatrix.needsUpdate = true;
    globeGroup.add(dotMesh);
  };
};

// Llama a buildDots (ya sin necesidad de ejecutar al inicio, se ejecutará al cargar la imagen)
buildDots();

    // ── City markers ──────────────────────────────────────────────────────────
    const markerGeo = new THREE.RingGeometry(2.5, 4, 32);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide, // importante para que se vea el anillo completo
    });
    const markerMesh = new THREE.InstancedMesh(markerGeo, markerMat, MARKERS.length);
    const dummy = new THREE.Object3D();

    MARKERS.forEach(([lat, lng], i) => {
      const pos = latLngToVec3(lat, lng, GLOBE_RADIUS + 1.5);
      dummy.position.copy(pos);
      dummy.lookAt(pos.clone().multiplyScalar(2));
      dummy.updateMatrix();
      markerMesh.setMatrixAt(i, dummy.matrix);
    });
    markerMesh.instanceMatrix.needsUpdate = true;
    globeGroup.add(markerMesh);

    // ── Arcs (GitHub: CubicBezierCurve3 + TubeBufferGeometry + setDrawRange) ──
const ARC_COLORS = [0x06b6d4, 0x3b82f6, 0x6366f1, 0x8b5cf6, 0x0ea5e9, 0x38bdf8];    interface ArcObj {
      tube:     THREE.Mesh;
      geo:      THREE.TubeGeometry;
      progress: number; // 0..1 draw position
      speed:    number;
      maxDraw:  number; // total index count
    }
    const arcObjects: ArcObj[] = [];

    ARC_DATA.forEach(([fLat, fLng, tLat, tLng], i) => {
      const start  = latLngToVec3(fLat, fLng, GLOBE_RADIUS + 1);
      const end    = latLngToVec3(tLat, tLng, GLOBE_RADIUS + 1);
      const [c1, c2] = arcControlPoints(start, end);

      const curve  = new THREE.CubicBezierCurve3(start, c1, c2, end);
      const geo    = new THREE.TubeGeometry(curve, 64, 0.6, 6, false);
      const mat    = new THREE.MeshBasicMaterial({
        color:       ARC_COLORS[i % ARC_COLORS.length],
        transparent: true,
        opacity:     0.85,
      });
      const tube = new THREE.Mesh(geo, mat);

      // Start invisible — setDrawRange animates it in
      const maxDraw = geo.index!.count;
      geo.setDrawRange(0, 0);

      globeGroup.add(tube);
      arcObjects.push({
        tube,
        geo,
        progress: Math.random(), // stagger start
        speed:    0.004 + Math.random() * 0.003,
        maxDraw,
      });
    });

    // ── Animate arcs: draw in then draw out (like GitHub's setDrawRange) ───────
    const updateArcs = () => {
      arcObjects.forEach((arc) => {
        arc.progress = (arc.progress + arc.speed) % 2; // 0→1 draw in, 1→2 draw out

        let drawn: number;
        if (arc.progress < 1) {
          // Drawing in
          drawn = Math.floor(arc.progress * arc.maxDraw);
        } else {
          // Drawing out from the start
          const erase = arc.progress - 1;
          const erased = Math.floor(erase * arc.maxDraw);
          drawn = arc.maxDraw - erased;
          arc.geo.setDrawRange(erased, drawn);
          return;
        }
        arc.geo.setDrawRange(0, drawn);
      });
    };

    // ── Animation loop ────────────────────────────────────────────────────────
    let rafId: number;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!prefersReduced) {
        globeGroup.rotation.y += ROTATION_SPEED;
        updateArcs();
      }
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
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