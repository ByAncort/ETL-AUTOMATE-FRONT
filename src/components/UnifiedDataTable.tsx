import { Link2, TrendingUp } from 'lucide-react';
import { UnifiedRecord } from '../types';

interface Props {
  records: UnifiedRecord[];
}

function ConfidenceBadge({ value }: { value: number }) {
  const color =
    value >= 95 ? 'text-emerald-600' :
    value >= 85 ? 'text-blue-600' :
    value >= 75 ? 'text-amber-600' : 'text-red-500';

  const barColor =
    value >= 95 ? '#059669' :
    value >= 85 ? '#2563eb' :
    value >= 75 ? '#d97706' : '#dc2626';

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: barColor }} />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${color}`}>{value.toFixed(1)}%</span>
    </div>
  );
}

export default function UnifiedDataTable({ records }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
            <Link2 size={14} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Registros Unificados</h2>
            <p className="text-xs text-slate-500">Record Linkage · Motor ML</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
          <TrendingUp size={11} />
          <span>4 entidades fusionadas</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {['ID Unificado', 'Nombre Entidad', 'Origen A', 'Origen B', 'Confianza ML'].map((col) => (
                <th key={col} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, i) => (
              <tr
                key={record.unifiedId}
                className={`border-b border-slate-100 transition-colors ${
                  record.highlight ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-slate-50'
                } ${i === records.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-5 py-3.5">
                  <code className="text-xs text-cyan-700 font-mono bg-cyan-50 px-1.5 py-0.5 rounded">
                    {record.unifiedId}
                  </code>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-900 font-medium">{record.entityName}</span>
                    {record.highlight && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 border border-violet-200">
                        Fusionado
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <code className="text-xs text-slate-500 font-mono">{record.originA}</code>
                </td>
                <td className="px-5 py-3.5">
                  <code className="text-xs text-slate-500 font-mono">{record.originB}</code>
                </td>
                <td className="px-5 py-3.5">
                  <ConfidenceBadge value={record.confidence} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
