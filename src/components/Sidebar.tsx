import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Plug,
  Database,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Zap,
  Users,
  Activity,
  Shield,
  GitMerge,
  Brain,
} from 'lucide-react';
import { cn } from '../lib/utils';

const sidebarItems = {
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard Admin', path: '/admin' },
    { icon: Users, label: 'Gestión Usuarios', path: '/admin/users' },
    { icon: Plug, label: 'Integraciones', path: '/admin/integrations' },
    { icon: Activity, label: 'Monitoreo', path: '/admin/monitoring' },
    { icon: Brain, label: 'LLMs', path: '/admin/llm-configs' },
    { icon: Settings, label: 'Configuración', path: '/admin/settings' },
  ],
  user: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Plug, label: 'Conexiones', path: '/dashboard/connections' },
    { icon: GitMerge, label: 'Integraciones', path: '/dashboard/integrations' },
    // { icon: Database, label: 'Explorador de Datos', path: '/dashboard/explorer' },
  ],
};

export default function Sidebar() {
  const { isAdmin, viewAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const showAdmin = isAdmin && viewAdmin;
  const navItems = showAdmin ? sidebarItems.admin : sidebarItems.user;
  const accentColor = showAdmin ? 'violet' : 'blue';

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== '/dashboard' && path !== '/admin' && location.pathname.startsWith(path));

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-200',
        collapsed ? 'w-16' : 'w-56'
      )}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className={cn(
        'flex items-center gap-3 px-4 h-14 border-b border-slate-200',
        collapsed && 'justify-center px-2'
      )}>
        <div className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0',
          showAdmin
            ? 'bg-violet-600 text-white'
            : 'bg-blue-600 text-white'
        )}>
          <Zap size={16} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">
              {showAdmin ? 'ETL Admin' : 'ETL Automate'}
            </div>
            <div className={cn(
              'text-[10px] font-medium truncate',
              showAdmin ? 'text-violet-500' : 'text-blue-500'
            )}>
              {showAdmin ? 'Admin Console' : 'Data Platform'}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute -right-3 top-14 z-10 flex items-center justify-center w-6 h-6 rounded-full',
          'bg-white border border-slate-300 text-slate-400',
          'hover:text-slate-600 hover:border-slate-400 transition-all duration-200',
          'shadow-sm'
        )}
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm',
                collapsed && 'justify-center px-2',
                active
                  ? accentColor === 'violet'
                    ? 'bg-violet-50 text-violet-700 font-medium'
                    : 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={cn('px-3 py-3 border-t border-slate-200', collapsed && 'text-center')}>
        <div className="flex items-start gap-2">
          <Cpu size={14} className={cn(
            'mt-0.5 flex-shrink-0',
            showAdmin ? 'text-violet-500' : 'text-emerald-500'
          )} />
          {!collapsed && (
            <div className="min-w-0">
              <div className={cn(
                'text-[10px] font-semibold truncate',
                showAdmin ? 'text-violet-500' : 'text-emerald-500'
              )}>
                {showAdmin ? 'MODO ADMIN' : 'SISTEMA ACTIVO'}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {showAdmin ? 'Privilegios totales' : 'v2.4.1 — online'}
              </div>
            </div>
          )}
          <Shield size={10} className={cn(
            'flex-shrink-0',
            showAdmin ? 'text-violet-400' : 'text-emerald-400'
          )} />
        </div>
      </div>
    </aside>
  );
}
