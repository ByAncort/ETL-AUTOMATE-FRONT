import { Activity, CheckCircle2, Clock, Cpu } from 'lucide-react';

const stats = [
  { icon: <Activity size={15} />, label: 'Integraciones Activas', value: '3 / 4', sub: '+1 esta semana' },
  { icon: <CheckCircle2 size={15} />, label: 'Registros Procesados', value: '33,859', sub: 'Últimas 24h' },
  { icon: <Clock size={15} />, label: 'Próxima Ejecución', value: '14:30 hrs', sub: 'ERP Ventas' },
  { icon: <Cpu size={15} />, label: 'Confianza Promedio ML', value: '87.9%', sub: 'Record Linkage' },
];

const iconColors = ['text-[#5741d8]', 'text-emerald-600', 'text-amber-600', 'text-violet-600'];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 bg-white border border-[#5741d8]/[0.08] rounded-xl px-4 py-3.5 hover:border-[#5741d8]/25 hover:shadow-[0_1px_6px_-2px_rgba(87,65,216,0.08)] transition-all"
        >
          <div className={`flex items-center justify-center w-9 h-9 rounded-lg bg-[#5741d8]/5 border border-[#5741d8]/10 flex-shrink-0 ${iconColors[i]}`}>
            {stat.icon}
          </div>
          <div>
            <div className="text-lg font-bold text-[#0a0a0a] leading-tight tabular-nums">{stat.value}</div>
            <div className="text-[10px] text-[#0a0a0a]/50 leading-tight">{stat.label}</div>
            <div className="text-[10px] text-[#0a0a0a]/35 mt-0.5">{stat.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
