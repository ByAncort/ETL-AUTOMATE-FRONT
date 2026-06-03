import { Clock, Plug, Trash2, MoreVertical, AlertCircle, Settings } from 'lucide-react';
import { Integration } from '../types';
import { IntegrationResponse } from '../types';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { GlowCard } from './ui/spotlight-card';

const statusConfig: Record<string, { dot: string; label: string }> = {
  active: { dot: 'bg-emerald-500', label: 'Activo' },
  pending: { dot: 'bg-amber-500', label: 'Pendiente' },
  error: { dot: 'bg-red-500', label: 'Error' },
  inactive: { dot: 'bg-slate-300', label: 'Inactivo' },
};

type Props = {
  integration: Integration | IntegrationResponse;
  onSchemaMatch?: (id: number) => void;
  onDelete?: (id: number) => void;
};

function isResponse(item: Integration | IntegrationResponse): item is IntegrationResponse {
  return 'apiA' in item && 'apiB' in item;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function IntegrationCard({ integration, onSchemaMatch, onDelete }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const statusKey = integration.status || 'inactive';
  const status = statusConfig[statusKey] || statusConfig.inactive;

  const displayName = isResponse(integration)
    ? integration.description || `Integración ${integration.id}`
    : integration.name;

  const displaySource = isResponse(integration)
    ? `API ${integration.apiA} → API ${integration.apiB}`
    : integration.source;

  const displayLastRun = isResponse(integration)
    ? formatDate(integration.createdAt)
    : integration.lastRun || 'Nunca';

  const cardId = integration.id;

  return (
    <GlowCard glowColor="blue" customSize className="h-full">
      <div className="relative p-5 flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[--text-primary] font-semibold text-sm leading-tight truncate">{displayName}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Plug size={10} className="text-[--text-muted] flex-shrink-0" />
              <span className="text-[--text-secondary] text-xs truncate">{displaySource}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[--accent]/5 border border-[--accent]/10">
            <span className={cn('w-1.5 h-1.5 rounded-full', status.dot)} />
            <span className="text-xs font-medium text-[--accent]/70">{status.label}</span>
          </div>
        </div>

        {statusKey === 'error' && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-1.5">
            <AlertCircle size={11} />
            <span>Fallo en conexión</span>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-[--border] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[--text-muted]">
          <Clock size={10} />
          <span>{displayLastRun}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-[--text-muted] hover:text-[--accent] hover:bg-[--accent]/5 transition-colors"
            >
              <MoreVertical size={14} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-[--bg-card] border border-[--border] rounded-lg shadow-lg z-20 overflow-hidden">
                {onSchemaMatch && (
                  <button
                    onClick={() => { onSchemaMatch(cardId as number); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[--text-secondary] hover:bg-[--accent]/5 transition-colors"
                  >
                    <Settings size={12} />
                    Configurar
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => { onDelete(cardId as number); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} />
                    Eliminar
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </GlowCard>
  );
}
