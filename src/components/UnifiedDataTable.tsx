import { Link2, TrendingUp } from 'lucide-react';
import { UnifiedRecord } from '../types';

interface Props {
  records: UnifiedRecord[];
}

function ConfidenceBadge({ value }: { value: number }) {
  const color =
    value >= 95 ? 'text-emerald-600' :
    value >= 85 ? 'text-[#5741d8]' :
    value >= 75 ? 'text-amber-600' : 'text-red-500';

  const barColor =
    value >= 95 ? '#059669' :
    value >= 85 ? '#5741d8' :
    value >= 75 ? '#d97706' : '#dc2626';

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#5741d8]/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: barColor }} />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${color}`}>{value.toFixed(1)}%</span>
    </div>
  );
}

export default function UnifiedDataTable({ records }: Props) {
  return (
    <div className="bg-white border border-[#5741d8]/[0.08] rounded-xl overflow-hidden shadow-[0_1px_3px_0_rgb(87_65_216/0.04),0_1px_2px_-1px_rgb(87_65_216/0.06)]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#5741d8]/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#5741d8]/10 border border-[#5741d8]/15 text-[#5741d8]">
            <Link2 size={14} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#0a0a0a]">Registros Unificados</h2>
            <p className="text-xs text-[#0a0a0a]/50">Record Linkage · Motor ML</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#5741d8] bg-[#5741d8]/10 border border-[#5741d8]/15 px-2.5 py-1 rounded-lg">
          <TrendingUp size={11} />
          <span>4 entidades fusionadas</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#5741d8]/[0.06] bg-[#5741d8]/[0.02]">
              {['ID Unificado', 'Nombre Entidad', 'Origen A', 'Origen B', 'Confianza ML'].map((col) => (
                <th key={col} className="px-5 py-3 text-left text-[11px] font-semibold text-[#5741d8]/60 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, i) => (
              <tr
                key={record.unifiedId}
                className={`border-b border-[#5741d8]/[0.06] transition-colors ${
                  record.highlight ? 'bg-[#5741d8]/[0.03] hover:bg-[#5741d8]/[0.05]' : 'hover:bg-[#5741d8]/[0.02]'
                } ${i === records.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-5 py-3.5">
                  <code className="text-xs text-[#5741d8]/70 font-mono bg-[#5741d8]/10 px-1.5 py-0.5 rounded">
                    {record.unifiedId}
                  </code>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#0a0a0a] font-medium">{record.entityName}</span>
                    {record.highlight && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gradient-to-r from-[#5741d8]/10 to-[#5741d8]/5 text-[#5741d8] border border-[#5741d8]/20">
                        Fusionado
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <code className="text-xs text-[#0a0a0a]/50 font-mono">{record.originA}</code>
                </td>
                <td className="px-5 py-3.5">
                  <code className="text-xs text-[#0a0a0a]/50 font-mono">{record.originB}</code>
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
