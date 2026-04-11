import { X, Sparkles, GitMerge, Play, CheckCheck } from 'lucide-react';

interface FieldMatch {
  fieldA: string;
  typeA: string;
  fieldB: string;
  typeB: string;
  confidence: number;
  method: string;
}

const fieldMatches: FieldMatch[] = [
  { fieldA: 'full_name', typeA: 'string', fieldB: 'nombre', typeB: 'string', confidence: 98, method: 'Semántico' },
  { fieldA: 'user_email', typeA: 'email', fieldB: 'correo', typeB: 'email', confidence: 99, method: 'Exacto' },
  { fieldA: 'phone', typeA: 'string', fieldB: 'telefono', typeB: 'string', confidence: 91, method: 'Embeddings' },
  { fieldA: 'created_at', typeA: 'datetime', fieldB: 'fecha_alta', typeB: 'date', confidence: 87, method: 'Semántico' },
  { fieldA: 'account_id', typeA: 'uuid', fieldB: 'cliente_id', typeB: 'integer', confidence: 74, method: 'Inferido' },
];

const typeColor: Record<string, string> = {
  string: 'text-blue-400',
  email: 'text-emerald-400',
  datetime: 'text-amber-400',
  date: 'text-amber-400',
  uuid: 'text-purple-400',
  integer: 'text-red-400',
};

interface Props {
  onClose: () => void;
}

function ConfidenceBar({ value }: { value: number }) {
  const color =
    value >= 95 ? '#34d399' :
    value >= 85 ? '#60a5fa' :
    value >= 75 ? '#fbbf24' : '#f87171';

  return (
    <div className="w-12 h-1 bg-[#1a2535] rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

export default function SchemaMatcherModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-[#1e2936] rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.7), rgba(59,130,246,0.7), transparent)' }} />

        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e2936]">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.25))', border: '1px solid rgba(139,92,246,0.4)' }}
            >
              <GitMerge size={15} style={{ color: '#a78bfa' }} />
            </div>
            <div>
              <h2 className="text-white font-semibold text-sm">Vista de Mapeo Inteligente</h2>
              <p className="text-xs text-gray-500">Schema Matcher · IA Semántica</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1a2535] border border-[#2a3a50] text-gray-400 hover:text-white transition-all"
          >
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0d1117] border border-[#2a3a50] text-xs font-semibold text-gray-300">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                API A — HubSpot CRM
              </div>
            </div>
            <div />
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0d1117] border border-[#2a3a50] text-xs font-semibold text-gray-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                API B — ERP MockAPI
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {fieldMatches.map((match, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <div className="flex items-center justify-between bg-[#0d1117] border border-[#1e2936] rounded-lg px-3 py-2.5 group hover:border-blue-500/30 transition-all">
                  <div>
                    <code className="text-xs text-gray-200 font-mono">{match.fieldA}</code>
                    <div className={`text-[10px] font-semibold mt-0.5 ${typeColor[match.typeA] ?? 'text-gray-400'}`}>{match.typeA}</div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 min-w-[80px]">
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                    style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
                  >
                    <Sparkles size={9} />
                    {match.confidence}%
                  </div>
                  <ConfidenceBar value={match.confidence} />
                  <div className="relative flex items-center w-full">
                    <div className="flex-1 h-px bg-gradient-to-r from-blue-500/40 via-purple-500/60 to-cyan-500/40" />
                    <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400" />
                  </div>
                  <span className="text-[9px] text-gray-600">{match.method}</span>
                </div>

                <div className="flex items-center justify-between bg-[#0d1117] border border-[#1e2936] rounded-lg px-3 py-2.5 group hover:border-cyan-500/30 transition-all">
                  <div>
                    <code className="text-xs text-gray-200 font-mono">{match.fieldB}</code>
                    <div className={`text-[10px] font-semibold mt-0.5 ${typeColor[match.typeB] ?? 'text-gray-400'}`}>{match.typeB}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d1117] border border-[#1e2936]">
            <Sparkles size={13} style={{ color: '#a78bfa' }} />
            <p className="text-xs text-gray-400">
              <span style={{ color: '#a78bfa' }} className="font-semibold">5 coincidencias detectadas</span>
              {' '}— Usando Embeddings Semánticos (modelo <code className="font-mono">etl-embed-v2</code>) para análisis de campos en idiomas mixtos.
            </p>
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-5">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98] hover:bg-[#1a2535]"
            style={{ borderColor: 'rgba(139,92,246,0.4)', color: '#a78bfa' }}
            onClick={onClose}
          >
            <CheckCheck size={15} />
            Confirmar Mapeo
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
            onClick={onClose}
          >
            <Play size={14} fill="currentColor" />
            Ejecutar ETL Ahora
          </button>
        </div>
      </div>
    </div>
  );
}
