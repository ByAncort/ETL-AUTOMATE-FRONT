import { Play, Settings, Clock, Database, Sparkles, AlertCircle } from 'lucide-react';
import { Integration, IntegrationStatus } from '../types';

const statusConfig: Record<IntegrationStatus, { color: string; bg: string; border: string; label: string }> = {
  active: { color: 'text-emerald-400', bg: 'bg-emerald-400', border: 'border-emerald-500/30', label: 'Activo' },
  pending: { color: 'text-amber-400', bg: 'bg-amber-400', border: 'border-amber-500/30', label: 'Pendiente' },
  error: { color: 'text-red-400', bg: 'bg-red-400', border: 'border-red-500/30', label: 'Error' },
  inactive: { color: 'text-gray-500', bg: 'bg-gray-500', border: 'border-gray-600/30', label: 'Inactivo' },
};

interface Props {
  integration: Integration;
  onSchemaMatch?: () => void;
}

export default function IntegrationCard({ integration, onSchemaMatch }: Props) {
  const status = statusConfig[integration.status];

  return (
    <div className="relative flex flex-col bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-blue-500/30 transition-all group">
      {integration.jsonPreview && (
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none overflow-hidden font-mono text-[9px] text-blue-300 leading-4 p-3 break-all select-none">
          {integration.jsonPreview.repeat(6)}
        </div>
      )}

      <div className="relative p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-[var(--text-primary)] font-semibold text-sm leading-tight">{integration.name}</h3>
            <p className="text-[var(--text-muted)] text-xs mt-0.5">{integration.source}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--bg-tertiary)] border ${status.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.bg} ${integration.status === 'active' ? 'animate-pulse' : ''}`} />
            <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
          </div>
        </div>

        {integration.mlBadge && (
          <div className="mb-3">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.15) 100%)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}
              onClick={onSchemaMatch}
            >
              <Sparkles size={11} />
              {integration.mlBadge.label}: {integration.mlBadge.score}% match
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Clock size={11} className="flex-shrink-0" />
            <span>{integration.lastRun}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Database size={11} className="flex-shrink-0" />
            <span>{integration.recordsProcessed} registros</span>
          </div>
        </div>

        {integration.status === 'error' && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-lg px-2.5 py-1.5">
            <AlertCircle size={11} />
            <span>Fallo en conexión — verificar credenciales</span>
          </div>
        )}
      </div>

      <div className="relative px-5 pb-4 flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-600/20 hover:border-blue-500/40 transition-all active:scale-95">
          <Play size={12} fill="currentColor" />
          Ejecutar Ahora
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-medium hover:border-[var(--border-hover)] hover:text-[var(--text-primary)] transition-all active:scale-95"
          onClick={onSchemaMatch}
        >
          <Settings size={12} />
          Configurar
        </button>
      </div>
    </div>
  );
}
