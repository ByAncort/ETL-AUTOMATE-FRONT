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
    { icon: Brain, label: 'LLMs', path: '/admin/llm-configs' },
  ],
  user: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Plug, label: 'Conexiones', path: '/dashboard/connections' },
    { icon: GitMerge, label: 'Integraciones', path: '/dashboard/integrations' },
  ],
};

const P = '#5741d8';

export default function Sidebar() {
  const { isAdmin, viewAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const showAdmin = isAdmin && viewAdmin;
  const navItems = showAdmin ? sidebarItems.admin : sidebarItems.user;

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== '/dashboard' && path !== '/admin' && location.pathname.startsWith(path));

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-white border-r border-[#5741d8]/[0.08] transition-all duration-200',
        collapsed ? 'w-16' : 'w-56'
      )}
      role="navigation"
      aria-label="Navegación principal"
    >
      {/* Header / Brand */}
      <div className={cn(
        'flex items-center gap-3 px-4 h-14 border-b border-[#5741d8]/[0.06]',
        collapsed && 'justify-center px-2'
      )}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-b from-[#5741d8] to-[#4635b5] text-white shadow-[0_1px_3px_rgba(87,65,216,0.3)] flex-shrink-0">
          <Zap size={16} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#0a0a0a] truncate">
              {showAdmin ? 'ETL Admin' : 'ETL Automate'}
            </div>
            <div className="text-[10px] font-medium text-[#5741d8]/60 truncate">
              {showAdmin ? 'Admin Console' : 'Data Platform'}
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute -right-3 top-14 z-10 flex items-center justify-center w-6 h-6 rounded-full',
          'bg-white border border-[#5741d8]/[0.12] text-[#5741d8]/50',
          'hover:text-[#5741d8]/80 hover:border-[#5741d8]/25 transition-all duration-200',
          'shadow-[0_1px_3px_rgba(87,65,216,0.08)]'
        )}
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation */}
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
                  ? 'bg-[#5741d8]/10 text-[#5741d8] font-medium shadow-[inset_0_1px_0_rgba(87,65,216,0.06)]'
                  : 'text-[#0a0a0a]/50 hover:bg-[#5741d8]/5 hover:text-[#0a0a0a]/70'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer status */}
      <div className={cn('px-3 py-3 border-t border-[#5741d8]/[0.06]', collapsed && 'text-center')}>
        <div className="flex items-start gap-2">
          <Cpu size={14} className="mt-0.5 flex-shrink-0 text-[#5741d8]/50" />
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[10px] font-semibold text-[#5741d8]/60 truncate">
                {showAdmin ? 'MODO ADMIN' : 'SISTEMA ACTIVO'}
              </div>
              <div className="text-[10px] text-[#0a0a0a]/35 mt-0.5">
                {showAdmin ? 'Privilegios totales' : 'v2.4.1 — online'}
              </div>
            </div>
          )}
          <Shield size={10} className="flex-shrink-0 text-[#5741d8]/30" />
        </div>
      </div>
    </aside>
  );
}
