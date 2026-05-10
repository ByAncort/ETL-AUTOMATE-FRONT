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
  FileText,
  Activity,
  Shield,
  ExternalLink,
  GitMerge,
} from 'lucide-react';
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const sidebarItems = {
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard Admin', path: '/admin' },
    { icon: Users, label: 'Gestión Usuarios', path: '/admin/users' },
    { icon: Plug, label: 'Integraciones', path: '/admin/integrations' },
    { icon: Activity, label: 'Monitoreo', path: '/admin/monitoring' },
    { icon: FileText, label: 'Logs Sistema', path: '/admin/logs' },
    // { icon: Shield, label: 'Seguridad', path: '/admin/security' },
    { icon: Settings, label: 'Configuración', path: '/admin/settings' },
  ],
user: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Plug, label: 'Conexiones', path: '/dashboard/connections' },
    { icon: GitMerge, label: 'Integraciones', path: '/dashboard/integrations' },
    { icon: Database, label: 'Explorador de Datos', path: '/dashboard/explorer' },
  ],
};

export default function Sidebar() {
  const { isAdmin } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isHoveringToggle, setIsHoveringToggle] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const showAdminItems = isAdmin;
  console.log('Sidebar render - isAdmin:', isAdmin, 'showAdminItems:', showAdminItems);
  const navItems = showAdminItems ? sidebarItems.admin : sidebarItems.user;
  const activeColor = showAdminItems ? 'purple' : 'blue';

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transition-all duration-300',
        'focus-within:ring-2 focus-within:ring-blue-500/50'
      )}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div 
        className={cn(
          'flex items-center gap-3 px-4 py-4 border-b border-[var(--border-color)]',
          collapsed ? 'justify-center px-2' : ''
        )}
      >
        <div 
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/25 flex-shrink-0"
          role="img"
          aria-label="ETL Automate"
        >
          <Zap size={18} className="text-white" aria-hidden="true" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="text-[var(--text-primary)] font-bold text-sm tracking-wide block truncate">
              {showAdminItems ? 'ETL ADMIN' : 'ETL AUTOMATE'}
            </span>
            <div className={cn(
              'text-[10px] tracking-widest font-medium truncate',
              showAdminItems ? 'text-purple-400' : 'text-blue-400'
            )}>
              {showAdminItems ? 'ADMIN CONSOLE' : 'DATA PLATFORM'}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        onMouseEnter={() => setIsHoveringToggle(true)}
        onMouseLeave={() => setIsHoveringToggle(false)}
        className={cn(
          'absolute -right-3 top-[4.5rem] z-20 flex items-center justify-center w-6 h-6 rounded-full',
          'bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)]',
          'hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]',
          isHoveringToggle && 'scale-110'
        )}
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        aria-expanded={!collapsed}
      >
        {collapsed ? (
          <ChevronRight size={12} aria-hidden="true" />
        ) : (
          <ChevronLeft size={12} aria-hidden="true" />
        )}
      </button>

      {collapsed && showAdminItems && (
        <div className="flex justify-center py-2" aria-hidden="true">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        </div>
      )}

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && item.path !== '/admin' && location.pathname.startsWith(item.path));
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-secondary)]',
                isActive
                  ? activeColor === 'purple'
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                    : 'bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                  : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]',
                collapsed ? 'justify-center px-2' : ''
              )}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? item.label : undefined}
            >
              <IconComponent 
                size={20} 
                className={cn(
                  'flex-shrink-0 transition-colors duration-200',
                  isActive 
                    ? activeColor === 'purple' ? 'text-purple-400' : 'text-blue-400'
                    : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                )}
                aria-hidden="true"
              />
              {!collapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <ExternalLink size={12} className="ml-auto text-gray-500" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </nav>

      <div className={cn(
        'px-3 py-4 border-t border-[var(--border-color)]',
        collapsed ? 'items-center' : ''
      )}>
        {collapsed ? (
          <div className="flex justify-center" aria-hidden="true">
            <div className={cn(
              'w-2 h-2 rounded-full animate-pulse',
              showAdminItems ? 'bg-purple-400' : 'bg-emerald-400'
            )} />
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Cpu size={14} className={cn(
              'mt-0.5 flex-shrink-0',
              showAdminItems ? 'text-purple-400' : 'text-emerald-400'
            )} aria-hidden="true" />
            <div className="min-w-0">
              <div className={cn(
                'text-[10px] font-semibold tracking-wider truncate',
                showAdminItems ? 'text-purple-400' : 'text-emerald-400'
              )}>
                {showAdminItems ? 'MODO ADMINISTRADOR' : 'SISTEMA OPERATIVO'}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate">
                {showAdminItems ? 'Privilegios totales' : 'Motor ML Activo'}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className={cn(
                  'w-1.5 h-1.5 rounded-full animate-pulse',
                  showAdminItems ? 'bg-purple-400' : 'bg-emerald-400'
                )} aria-hidden="true" />
                <span className="text-[9px] text-[var(--text-muted)] truncate">
                  {showAdminItems ? 'v3.0.0 — admin' : 'v2.4.1 — online'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse { animation: none; }
          .transition-all { transition: none; }
        }
      `}</style>
    </aside>
  );
}