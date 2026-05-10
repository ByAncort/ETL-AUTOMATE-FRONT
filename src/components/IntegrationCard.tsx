import { Play, Settings, Clock, Database, Plug, ArrowRight, Trash2, MoreVertical, AlertCircle } from 'lucide-react';
import { Integration } from '../types';
import { IntegrationResponse } from '../types';

interface IntegrationDisplay {
  id: string | number;
  name: string;
  source: string;
  status: 'active' | 'pending' | 'error' | 'inactive';
  lastRun?: string;
  recordsProcessed?: string;
}

const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  active: { color: 'text-emerald-400', bg: 'bg-emerald-400', border: 'border-emerald-500/30', label: 'Activo' },
  pending: { color: 'text-amber-400', bg: 'bg-amber-400', border: 'border-amber-500/30', label: 'Pendiente' },
  error: { color: 'text-red-400', bg: 'bg-red-400', border: 'border-red-500/30', label: 'Error' },
  inactive: { color: 'text-gray-500', bg: 'bg-gray-500', border: 'border-gray-600/30', label: 'Inactivo' },
};

type IntegrationCardProps = {
  integration: IntegrationDisplay | IntegrationResponse;
  onSchemaMatch?: () => void;
  onDelete?: (id: number) => void;
};

function isIntegrationResponse(item: any): item is IntegrationResponse {
  return 'apiA' in item && 'apiB' in item;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function IntegrationCard({ integration, onSchemaMatch, onDelete }: IntegrationCardProps) {
  const statusKey = integration.status || 'inactive';
  const status = statusConfig[statusKey] || statusConfig.inactive;

  const displayName = isIntegrationResponse(integration)
    ? integration.description || `Integración ${integration.id}`
    : integration.name;

  const displaySource = isIntegrationResponse(integration)
    ? `API ${integration.apiA} → API ${integration.apiB}`
    : integration.source;

  const displayLastRun = isIntegrationResponse(integration)
    ? formatDate(integration.createdAt)
    : integration.lastRun || 'Nunca';

  const displayRecords = isIntegrationResponse(integration)
    ? '—'
    : integration.recordsProcessed || '0';

  const cardId = isIntegrationResponse(integration) ? integration.id : integration.id;

  return (
    <div className="relative flex flex-col bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-blue-500/30 transition-all group">
      <div className="relative p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[var(--text-primary)] font-semibold text-sm leading-tight truncate">{displayName}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Plug size={10} className="text-[var(--text-muted)] flex-shrink-0" />
              <span className="text-[var(--text-muted)] text-xs truncate">{displaySource}</span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--bg-tertiary)] border ${status.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.bg} ${statusKey === 'active' ? 'animate-pulse' : ''}`} />
            <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            <ArrowRight size={10} className="text-blue-400" />
            <span className="text-xs text-[var(--text-muted)]">Origen</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            <ArrowRight size={10} className="text-cyan-400 -rotate-90" />
            <span className="text-xs text-[var(--text-muted)]">Destino</span>
          </div>
        </div>

        {statusKey === 'error' && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-lg px-2.5 py-1.5">
            <AlertCircle size={11} />
            <span>Fallo en conexión</span>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Clock size={10} />
          <span>{displayLastRun}</span>
        </div>
        <div className="flex items-center gap-1">
          {onSchemaMatch && (
            <button
              onClick={onSchemaMatch}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
              title="Configurar"
            >
              <Settings size={12} />
            </button>
          )}
          {onDelete && typeof cardId === 'number' && (
            <button
              onClick={() => onDelete(cardId as number)}
              className="p-1.5 rounded-lg text-red-400/70 hover:text-red-400 hover:bg-red-950/30 transition-all"
              title="Eliminar"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
