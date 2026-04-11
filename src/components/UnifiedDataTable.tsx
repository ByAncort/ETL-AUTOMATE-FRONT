import { Link2, TrendingUp } from 'lucide-react';
import { UnifiedRecord } from '../types';

interface Props {
  records: UnifiedRecord[];
}

function ConfidenceBadge({ value }: { value: number }) {
  const color =
    value >= 95 ? 'text-emerald-400' :
    value >= 85 ? 'text-blue-400' :
    value >= 75 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-[#1a2535] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${value}%`,
            background: value >= 95
              ? '#34d399'
              : value >= 85
              ? '#60a5fa'
              : value >= 75
              ? '#fbbf24'
              : '#f87171',
          }}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${color}`}>{value.toFixed(1)}%</span>
    </div>
  );
}

export default function UnifiedDataTable({ records }: Props) {
  return (
    <div className="bg-[#111827] border border-[#1e2936] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2936]">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30">
            <Link2 size={14} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Vista Previa de Registros Unificados</h2>
            <p className="text-xs text-gray-500">Record Linkage · Motor ML</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-600/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
          <TrendingUp size={11} />
          <span>4 entidades fusionadas</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1a2535]">
              {['ID Unificado', 'Nombre Entidad', 'Origen A', 'Origen B', 'Confianza ML'].map((col) => (
                <th key={col} className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record, i) => (
              <tr
                key={record.unifiedId}
                className={`border-b border-[#1a2535]/60 transition-colors ${
                  record.highlight
                    ? 'bg-blue-600/5 hover:bg-blue-600/10'
                    : 'hover:bg-[#1a2535]/40'
                } ${i === records.length - 1 ? 'border-b-0' : ''}`}
              >
                <td className="px-5 py-3.5">
                  <code className="text-xs text-cyan-400 font-mono bg-cyan-950/30 px-1.5 py-0.5 rounded">
                    {record.unifiedId}
                  </code>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-200 font-medium">{record.entityName}</span>
                    {record.highlight && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
                      >
                        Fusionado
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <code className="text-xs text-gray-400 font-mono">{record.originA}</code>
                </td>
                <td className="px-5 py-3.5">
                  <code className="text-xs text-gray-400 font-mono">{record.originB}</code>
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
