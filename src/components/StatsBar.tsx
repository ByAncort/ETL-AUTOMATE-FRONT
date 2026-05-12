import { Activity, CheckCircle2, Clock, Cpu } from 'lucide-react';

const stats = [
  { icon: <Activity size={15} className="text-blue-600" />, label: 'Integraciones Activas', value: '3 / 4', sub: '+1 esta semana' },
  { icon: <CheckCircle2 size={15} className="text-emerald-600" />, label: 'Registros Procesados', value: '33,859', sub: 'Últimas 24h' },
  { icon: <Clock size={15} className="text-amber-600" />, label: 'Próxima Ejecución', value: '14:30 hrs', sub: 'ERP Ventas' },
  { icon: <Cpu size={15} className="text-violet-600" />, label: 'Confianza Promedio ML', value: '87.9%', sub: 'Record Linkage' },
];

export default function StatsBar() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 hover:border-slate-300 transition-all"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex-shrink-0">
            {stat.icon}
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 leading-tight tabular-nums">{stat.value}</div>
            <div className="text-[10px] text-slate-500 leading-tight">{stat.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{stat.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
