import React from 'react';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ icon, title, description, children }: Props) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-900">{title}</h1>
              {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
            </div>
          </div>
          {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
      </div>
    </div>
  );
}
