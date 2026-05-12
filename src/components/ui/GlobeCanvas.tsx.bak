import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import cobeTextureUrl from '../../assets/cobe-texture.png';

// ─── Constants ────────────────────────────────────────────────────────────────

const GLOBE_RADIUS   = 150;
const DEG2RAD        = Math.PI / 180;
const DOT_DENSITY    = 9;
const DOT_ROWS       = 180;
const DOT_SIZE       = 0.7;
const DOT_SEGMENTS   = 32;
const ROTATION_SPEED = 0.0006;

const ARC_DATA: [number, number, number, number][] = [
  [ 22.32,  114.17, -33.87,  151.21],
  [ 28.61,   77.21,  51.51,   -0.13],
  [-33.87,  151.21,  34.05, -118.24],
  [ 51.51,   -0.13,  14.60,  120.98],
  [ 21.31, -157.86,  40.71,  -74.01],
  [-34.60,  -58.38,  22.32,  114.17],
  [ 11.99,    8.57, -22.91,  -43.17],
  [ 37.57,  126.98,  35.68,  139.65],
  [ 52.52,   13.41,  34.05, -118.24],
  [ 48.86,    2.35,  34.05, -118.24],
  [ 49.28, -123.12,  52.52,   13.41],
  [ 31.23,  121.47,  34.05, -118.24],
  [ 41.90,   12.50,  48.86,    2.35],
  [ 14.60,  120.98,  51.51,   -0.13],
  [-22.91,  -43.17,  28.61,   77.21],
];

const MARKERS: [number, number][] = [
  [ 22.32,  114.17], [ 28.61,   77.21], [ -1.30,   36.85],
  [ 35.68,  139.65], [ 51.51,   -0.13], [ 36.16, -115.12],
  [-33.87,  151.21], [ 21.31, -157.86], [ -6.21,  106.85],
  [ 11.99,    8.57], [-34.60,  -58.38], [ 48.86,    2.35],
  [ 14.60,  120.98], [ 34.05, -118.24], [ 37.57,  126.98],
  [ 41.90,   12.50], [ 31.23,  121.47], [ 49.28, -123.12],
  [ 52.52,   13.41], [-22.91,  -43.17],
];

const ARC_COLORS = [0x06b6d4, 0x3b82f6, 0x6366f1, 0x8b5cf6, 0x0ea5e9, 0x38bdf8];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi   = (90 - lat) * DEG2RAD;
  const theta = (lng + 180) * DEG2RAD;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta),
  );
}

function arcControlPoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  arcHeightFactor = 0.4,
): [THREE.Vector3, THREE.Vector3] {
  const dist   = start.distanceTo(end);
  const midOut = start.clone().lerp(end, 0.5).normalize()
    .multiplyScalar(GLOBE_RADIUS + dist * arcHeightFactor);
  return [
    start.clone().lerp(midOut, 0.5),
    end.clone().lerp(midOut, 0.5),
  ];
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface GlobeCanvasProps {
  /** Extra Tailwind / CSS classes applied to the wrapper div */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GlobeCanvas({ className = 'fixed inset-0 w-full h-full' }: GlobeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      2000,
    );
    camera.position.set(0, 0, 580);

    // ── Globe group ──────────────────────────────────────────────────────────
    const globeGroup = new THREE.Group();
    const tzOffset   = new Date().getTimezoneOffset() || 0;
    globeGroup.rotation.y = Math.PI * (tzOffset / (60 * 12));
    scene.add(globeGroup);

    // ── Base sphere ──────────────────────────────────────────────────────────
    globeGroup.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64),
        new THREE.MeshPhongMaterial({ color: 0x0c1e2e, shininess: 10 }),
      ),
    );

    // ── Lights ───────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x1a2a4a, 1.5));
    const sun = new THREE.DirectionalLight(0x4488ff, 2.5);
    sun.position.set(-400, 300, 300);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x0066ff, 1.2);
    rim.position.set(400, -200, -300);
    scene.add(rim);

    // ── Halo (GitHub technique: shader on BackSide of larger sphere) ─────────
    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        uniforms: {},
        vertexShader: `
          varying float intensity;
          void main() {
            vec3 vN = normalize(normalMatrix * normal);
            vec3 vE = normalize(vec3(modelViewMatrix * vec4(position, 1.0)));
            intensity = pow(abs(dot(vN, vE)), 4.5);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying float intensity;
          void main() {
            gl_FragColor = vec4(vec3(0.05, 0.25, 0.65) * intensity, intensity * 0.85);
          }
        `,
      }),
    );
    halo.scale.multiplyScalar(1.18);
    halo.rotateX(Math.PI * 0.03);
    halo.rotateY(Math.PI * 0.03);
    scene.add(halo);

    // ── Continent dots (GitHub technique: PNG → getImageData → InstancedMesh) ─
    const img    = new Image();
    img.crossOrigin = 'anonymous';
    img.src = cobeTextureUrl;

    img.onload = () => {
      const offscreen  = document.createElement('canvas');
      offscreen.width  = img.width;
      offscreen.height = img.height;
      const octx = offscreen.getContext('2d')!;
      octx.drawImage(img, 0, 0);
      const { data, width, height } = octx.getImageData(0, 0, img.width, img.height);

      const isLand = (lat: number, lng: number): boolean => {
        const ix  = Math.round(((lng + 180) / 360) * (width  - 1));
        const iy  = Math.round(((90  - lat) / 180) * (height - 1));
        const idx = (iy * width + ix) * 4;
        return (data[idx] + data[idx + 1] + data[idx + 2]) / 3 > 40;
      };

      const circleGeo = new THREE.CircleGeometry(DOT_SIZE, DOT_SEGMENTS);
      const matrices: THREE.Matrix4[] = [];
      const dummy = new THREE.Object3D();

      for (let lat = -90; lat <= 90; lat += 180 / DOT_ROWS) {
        const r   = Math.cos(Math.abs(lat) * DEG2RAD) * GLOBE_RADIUS;
        const n   = Math.round(r * Math.PI * 2 * DOT_DENSITY * 0.018);
        for (let x = 0; x < n; x++) {
          const lng = -180 + (x * 360) / n;
          if (!isLand(lat, lng)) continue;
          const pos = latLngToVec3(lat, lng, GLOBE_RADIUS + 0.3);
          dummy.position.copy(pos);
          dummy.lookAt(pos.clone().multiplyScalar(2));
          dummy.updateMatrix();
          matrices.push(dummy.matrix.clone());
        }
      }

      const dotMesh = new THREE.InstancedMesh(
        circleGeo,
        new THREE.MeshBasicMaterial({ color: 0x1e88e5, transparent: true, opacity: 0.75 }),
        matrices.length,
      );
      matrices.forEach((m, i) => dotMesh.setMatrixAt(i, m));
      dotMesh.instanceMatrix.needsUpdate = true;
      globeGroup.add(dotMesh);
    };

    // ── City markers ─────────────────────────────────────────────────────────
    const markerMesh = new THREE.InstancedMesh(
      new THREE.RingGeometry(2.5, 4, 32),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85, side: THREE.DoubleSide }),
      MARKERS.length,
    );
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

    // ── Arcs (GitHub: CubicBezierCurve3 + TubeGeometry + setDrawRange) ───────
    interface ArcObj {
      geo:      THREE.TubeGeometry;
      progress: number;
      speed:    number;
      maxDraw:  number;
    }
    const arcObjects: ArcObj[] = [];

    ARC_DATA.forEach(([fLat, fLng, tLat, tLng], i) => {
      const start        = latLngToVec3(fLat, fLng, GLOBE_RADIUS + 1);
      const end          = latLngToVec3(tLat, tLng, GLOBE_RADIUS + 1);
      const [c1, c2]     = arcControlPoints(start, end);
      const geo          = new THREE.TubeGeometry(
        new THREE.CubicBezierCurve3(start, c1, c2, end), 64, 0.6, 6, false,
      );
      geo.setDrawRange(0, 0);
      globeGroup.add(
        new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({ color: ARC_COLORS[i % ARC_COLORS.length], transparent: true, opacity: 0.85 }),
        ),
      );
      arcObjects.push({ geo, progress: Math.random(), speed: 0.004 + Math.random() * 0.003, maxDraw: geo.index!.count });
    });

    const updateArcs = () => {
      arcObjects.forEach((arc) => {
        arc.progress = (arc.progress + arc.speed) % 2;
        if (arc.progress < 1) {
          arc.geo.setDrawRange(0, Math.floor(arc.progress * arc.maxDraw));
        } else {
          const erased = Math.floor((arc.progress - 1) * arc.maxDraw);
          arc.geo.setDrawRange(erased, arc.maxDraw - erased);
        }
      });
    };

    // ── Animation loop ───────────────────────────────────────────────────────
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

    // ── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}