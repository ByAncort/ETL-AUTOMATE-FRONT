import { Activity, CheckCircle2, Clock, Cpu } from 'lucide-react';

const stats = [
  { icon: <Activity size={15} className="text-blue-400" />, label: 'Integraciones Activas', value: '3 / 4', sub: '+1 esta semana' },
  { icon: <CheckCircle2 size={15} className="text-emerald-400" />, label: 'Registros Procesados', value: '33,859', sub: 'Últimas 24h' },
  { icon: <Clock size={15} className="text-amber-400" />, label: 'Próxima Ejecución', value: '14:30 hrs', sub: 'ERP Ventas' },
  { icon: <Cpu size={15} style={{ color: '#a78bfa' }} />, label: 'Confianza Promedio ML', value: '87.9%', sub: 'Record Linkage' },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 hover:border-[var(--border-hover)] transition-all"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex-shrink-0">
            {stat.icon}
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--text-primary)] leading-tight tabular-nums">{stat.value}</div>
            <div className="text-[10px] text-[var(--text-muted)] leading-tight">{stat.label}</div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5 opacity-70">{stat.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
