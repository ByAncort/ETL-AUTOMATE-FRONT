import { cn } from '../../lib/utils';

interface GlowCardProps {
  glowColor?: string;
  customSize?: boolean;
  className?: string;
  children: React.ReactNode;
}

const glowVariants: Record<string, { ring: string; shadow: string }> = {
  blue: {
    ring: 'ring-blue-500/20',
    shadow: 'shadow-blue-500/5',
  },
  violet: {
    ring: 'ring-violet-500/20',
    shadow: 'shadow-violet-500/5',
  },
  emerald: {
    ring: 'ring-emerald-500/20',
    shadow: 'shadow-emerald-500/5',
  },
  amber: {
    ring: 'ring-amber-500/20',
    shadow: 'shadow-amber-500/5',
  },
};

export function GlowCard({ glowColor = 'blue', customSize, className, children }: GlowCardProps) {
  const variant = glowVariants[glowColor] || glowVariants.blue;

  return (
    <div
      className={cn(
        'relative flex flex-col bg-white border border-slate-200/80 rounded-xl',
        'shadow-sm hover:shadow-md transition-all duration-200',
        'ring-1 ring-transparent hover:ring-2',
        variant.ring,
        variant.shadow,
        customSize ? className || '' : '',
        !customSize && 'p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
