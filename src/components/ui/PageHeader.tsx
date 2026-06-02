import React from 'react';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ icon, title, description, children }: Props) {
  return (
    <div className="border-b border-[#5741d8]/[0.08] bg-white">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#5741d8]/10 border border-[#5741d8]/15 text-[#5741d8] flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-[#0a0a0a]">{title}</h1>
              {description && <p className="text-sm text-[#0a0a0a]/50 mt-0.5">{description}</p>}
            </div>
          </div>
          {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}
