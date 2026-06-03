import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Plug, ChevronLeft, ChevronRight, Cpu, Users, GitMerge, Brain, Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const sidebarItems = {
  admin: [
    { icon: LayoutDashboard, label: 'Dashboard Admin', path: '/admin' },
    { icon: Users, label: 'Usuarios', path: '/admin/users' },
    { icon: Plug, label: 'Integraciones', path: '/admin/integrations' },
    { icon: Brain, label: 'LLMs', path: '/admin/llm-configs' },
  ],
  user: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Plug, label: 'Conexiones', path: '/dashboard/connections' },
    { icon: GitMerge, label: 'Integraciones', path: '/dashboard/integrations' },
  ],
};

const nodeColors = ['#2563eb', '#3b82f6', '#6366f1', '#0ea5e9'];

function FlowLine() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 overflow-hidden opacity-30">
      <svg className="w-full h-full" viewBox="0 0 224 48" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
            <stop offset="30%" stopColor="#2563eb" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 24 Q56 8 112 24 Q168 40 224 24"
          fill="none"
          stroke="url(#pipeGrad)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <motion.circle
          r="2.5" fill="#2563eb"
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ offsetPath: "path('M0 24 Q56 8 112 24 Q168 40 224 24')" }}
        />
        <motion.circle
          r="1.5" fill="#6366f1"
          initial={{ offsetDistance: '20%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1 }}
          style={{ offsetPath: "path('M0 24 Q56 8 112 24 Q168 40 224 24')" }}
        />
      </svg>
    </div>
  );
}

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
        'relative flex flex-col h-screen select-none',
        'bg-white border-r border-slate-200/50',
        collapsed ? 'w-[68px]' : 'w-56',
        'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
      )}
      role="navigation"
      aria-label="Navegación principal"
    >
      {/* Pipeline flow line across bottom */}
      <FlowLine />

      {/* Brand header — pipeline node 0 */}
      <div className={cn(
        'relative flex items-center gap-3 px-4 h-14 flex-shrink-0 border-b border-slate-100',
        collapsed && 'justify-center px-2',
      )}>
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-sm flex-shrink-0 overflow-hidden">
          <Zap size={16} className="relative z-10" />
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        {!collapsed && (
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            className="min-w-0"
          >
            <div className="text-sm font-bold text-slate-800 truncate tracking-tight">
              {showAdmin ? 'ETL Admin' : 'ETL Automate'}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Pipeline activo
            </div>
          </motion.div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          'absolute -right-3 top-[46px] z-20 flex items-center justify-center w-6 h-6 rounded-full',
          'bg-white border border-slate-200 text-slate-400 shadow-sm',
          'hover:border-blue-300 hover:text-blue-600 transition-all duration-200',
        )}
        aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        <motion.div
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </motion.div>
      </button>

      {/* Navigation — pipeline stations */}
      <nav className="relative flex-1 px-2.5 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item, idx) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          const nodeColor = nodeColors[idx % nodeColors.length];

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm',
                'cursor-pointer outline-none transition-all duration-200',
                collapsed && 'justify-center px-2',
                active
                  ? 'text-blue-700 bg-blue-50/70'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
              )}
              title={collapsed ? item.label : undefined}
            >
              {/* Connector dot — left rail */}
              <div className="absolute left-0 top-0 bottom-0 w-5 flex items-center justify-center">
                <div className={cn(
                  'w-1 h-1 rounded-full transition-all duration-300',
                  active ? 'bg-blue-500 shadow-[0_0_6px_rgba(37,99,235,0.5)]' : 'bg-slate-300',
                )} />
              </div>

              {/* Pipeline glow on active */}
              {active && (
                <motion.div
                  layoutId="pipelineGlow"
                  className="pointer-events-none absolute inset-0 rounded-lg"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                >
                  <div
                    className="absolute inset-0 rounded-lg opacity-10"
                    style={{ backgroundColor: nodeColor }}
                  />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{
                      backgroundColor: nodeColor,
                      boxShadow: `0 0 8px ${nodeColor}66`,
                    }}
                  />
                </motion.div>
              )}

              <Icon size={18} className={cn(
                'flex-shrink-0',
                active ? 'text-blue-600' : 'text-slate-400',
              )} />
              {!collapsed && (
                <span className={cn(
                  'truncate',
                  active && 'font-semibold',
                )}>
                  {item.label}
                </span>
              )}

              {/* Flow indicator — active node gets a data packet */}
              {active && (
                <motion.div
                  className="absolute right-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: nodeColor }}
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </button>
          );
        })}

      </nav>

      {/* Footer — pipeline end node */}
      <div className={cn(
        'relative px-3.5 py-3 border-t border-slate-100',
        collapsed && 'text-center',
      )}>
        <div className="flex items-start gap-2.5">
          <div className="relative mt-0.5 flex-shrink-0">
            <Cpu size={14} className="text-slate-400" />
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[10px] font-semibold truncate text-slate-400 tracking-wider">
                {showAdmin ? 'MODO ADMIN' : 'SISTEMA ACTIVO'}
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5 truncate">
                {showAdmin ? 'Privilegios totales' : 'v2.4.1 — online'}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
