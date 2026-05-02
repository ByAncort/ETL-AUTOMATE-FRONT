// components/Sidebar.tsx
import { useState } from 'react';
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
} from 'lucide-react';

interface SidebarProps {
  isAdminView: boolean;
}

export default function Sidebar({ isAdminView }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  // Items según el modo (usuario normal vs administrador)
  const navItems = isAdminView
    ? [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard Admin', active: true },
        { icon: <Users size={20} />, label: 'Gestión Usuarios', active: false },
        { icon: <Plug size={20} />, label: 'Integraciones', active: false },
        { icon: <Activity size={20} />, label: 'Monitoreo', active: false },
        { icon: <FileText size={20} />, label: 'Logs Sistema', active: false },
        { icon: <Shield size={20} />, label: 'Seguridad', active: false },
        { icon: <Settings size={20} />, label: 'Configuración', active: false },
      ]
    : [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
        { icon: <Plug size={20} />, label: 'Conexiones', active: false },
        { icon: <Database size={20} />, label: 'Explorador de Datos', active: false },
        { icon: <Settings size={20} />, label: 'Configuración', active: false },
      ];

  return (
    <aside
      className={`relative flex flex-col h-screen bg-[#0d1117] border-r border-[#1e2936] transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#1e2936] ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-white font-bold text-sm tracking-wider">
              {isAdminView ? 'ETL ADMIN' : 'ETL AUTOMATE'}
            </span>
            <div className={`text-[10px] tracking-widest font-medium ${isAdminView ? 'text-purple-400' : 'text-blue-400'}`}>
              {isAdminView ? 'ADMIN CONSOLE' : 'DATA PLATFORM'}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-14 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-[#1a2535] border border-[#2a3a50] text-gray-400 hover:text-white hover:bg-[#243045] transition-all"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Badge de modo admin cuando está colapsado */}
      {collapsed && isAdminView && (
        <div className="flex justify-center mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        </div>
      )}

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
              item.active
                ? isAdminView
                  ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                  : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:bg-[#1a2535] hover:text-gray-200'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      <div className={`px-3 py-4 border-t border-[#1e2936] ${collapsed ? 'items-center' : ''}`}>
        {collapsed ? (
          <div className="flex justify-center">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isAdminView ? 'bg-purple-400' : 'bg-emerald-400'}`} />
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Cpu size={14} className={`${isAdminView ? 'text-purple-400' : 'text-emerald-400'} mt-0.5 flex-shrink-0`} />
            <div>
              <div className={`text-[10px] font-semibold tracking-wider ${isAdminView ? 'text-purple-400' : 'text-emerald-400'}`}>
                {isAdminView ? 'MODO ADMINISTRADOR' : 'SISTEMA OPERATIVO'}
              </div>
              <div className="text-[10px] text-gray-500 mt-0.5">
                {isAdminView ? 'Privilegios totales' : 'Motor ML Activo'}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAdminView ? 'bg-purple-400' : 'bg-emerald-400'}`} />
                <span className="text-[9px] text-gray-500">
                  {isAdminView ? 'v3.0.0 — admin' : 'v2.4.1 — online'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}