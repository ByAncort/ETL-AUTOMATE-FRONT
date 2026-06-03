import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Globe } from './ui/cobe-globe';
import { GridPattern } from './ui/grid-pattern';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[--bg-page]">
      {/* Decorative bg elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[--accent]/[0.06] to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-[--accent]/[0.04] to-transparent blur-2xl" />
        <GridPattern
          width={40}
          height={40}
          className="[mask-image:radial-gradient(600px_circle_at_50%_50%,white,transparent)] opacity-[0.35]"
        />
      </div>

      {/* Left: form */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--accent) 0.5px, transparent 0)`,
            backgroundSize: '32px 32px',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
          }}
        />

        <motion.div
          className="w-full max-w-sm"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUp} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[--accent]" />
              <div className="text-[11px] font-medium tracking-[0.25em] uppercase text-[--text-muted]">
                Enterprise Data Platform
              </div>
            </div>
            <h1 className="text-[30px] font-semibold tracking-tight text-[--text-primary] leading-none">
              ETL Automate
            </h1>
            <p className="mt-2 text-sm text-[--text-secondary]">{title}</p>
            <div className="mt-4 h-px w-12 bg-gradient-to-r from-[--accent]/30 to-transparent" />
          </motion.div>

          <motion.div variants={fadeUp}>
            {children}
          </motion.div>
        </motion.div>
      </div>

      {/* Right: globe panel */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 overflow-hidden p-12 relative bg-[--bg-page]">
        <div className="w-full max-w-lg relative z-10">
          <Globe
            baseColor={[0.2, 0.4, 0.8]}
            markerColor={[0.6, 0.8, 1]}
            glowColor={[0.1, 0.2, 0.5]}
            dark={1}
            mapBrightness={6}
            speed={0.005}
          />
        </div>

        <div className="absolute bottom-12 left-0 right-0 text-center z-10">
          <div className="text-[10px] font-medium tracking-[0.3em] uppercase text-[--text-muted]/40">
            ETL Automate v2.0
          </div>
        </div>
      </div>
    </div>
  );
}
