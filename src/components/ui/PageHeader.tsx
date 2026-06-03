import React from 'react';
import { motion } from 'motion/react';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ icon, title, description, children }: Props) {
  return (
    <div className="bg-transparent">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[--accent]/10 border border-[--accent]/15 text-[--accent] flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-[--text-primary]">{title}</h1>
              {description && <p className="text-sm text-[--text-secondary] mt-0.5">{description}</p>}
            </div>
          </div>
          {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
      </div>
      <motion.div
        className="h-[1px] w-full"
        style={{
          background: 'linear-gradient(90deg, #ff0040, #ff8c00, #40ff00, #00d4ff, #7a00ff, #ff0040)',
          backgroundSize: '300% 100%',
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
