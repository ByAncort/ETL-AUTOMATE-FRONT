import { Bell, Plus, Search, User } from 'lucide-react';

interface HeaderProps {
  onNewIntegration: () => void;
}

export default function Header({ onNewIntegration }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#0d1117] border-b border-[#1e2936]">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Gestión de Integraciones</h1>
        <p className="text-xs text-gray-500 mt-0.5">Panel de control · ETL Pipeline Manager</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar integración..."
            className="bg-[#1a2535] border border-[#2a3a50] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/60 w-52 transition-all"
          />
        </div>

        <button className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#1a2535] border border-[#2a3a50] text-gray-400 hover:text-white hover:bg-[#243045] transition-all">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        <button
          onClick={onNewIntegration}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/40 hover:shadow-blue-700/50 active:scale-95"
        >
          <Plus size={16} />
          Nueva Integración
        </button>

        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white cursor-pointer">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}
