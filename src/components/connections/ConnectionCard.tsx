import { useState } from 'react';
import {
  Trash2, ExternalLink, Copy, Check,
  MoreVertical, Globe, Key, Clock, Play
} from 'lucide-react';
import { ApiConnection } from '../../hooks/useApiConnections';
import { cn } from '../../lib/utils';
import { GlowCard } from '../ui/spotlight-card';

const methodColors: Record<string, string> = {
  GET: 'bg-[--accent]/10 text-[--accent] border-[--accent]/20',
  POST: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  PUT: 'bg-amber-100 text-amber-700 border-amber-200',
  DELETE: 'bg-red-100 text-red-700 border-red-200',
  PATCH: 'bg-blue-100 text-blue-700 border-blue-200',
};

interface Props {
  connection: ApiConnection;
  onDelete: (id: number) => void;
  onTest: (connection: ApiConnection) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export default function ConnectionCard({ connection, onDelete, onTest }: Props) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const methodClass = methodColors[connection.method] || 'bg-slate-100 text-slate-600 border-slate-200';
  const fullUrl = connection.url + (connection.pathParams || '');

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group relative bg-[--bg-card] border border-[--border] rounded-xl hover:border-[--accent]/30 hover:shadow-[0_1px_8px_-2px_var(--accent)/0.08] transition-all"
      role="article"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={cn('flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border', methodClass)}>
              {connection.method}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-[--text-primary] truncate">
                {connection.description || `Conexión ${connection.id}`}
              </h3>
              <p className="text-xs text-[--text-secondary] truncate mt-1 font-mono" title={fullUrl}>
                {fullUrl.length > 40 ? fullUrl.substring(0, 40) + '...' : fullUrl}
              </p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg text-[--text-muted] hover:text-[--accent] hover:bg-[--accent]/5 transition-colors"
              aria-label="Más opciones"
            >
              <MoreVertical size={16} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-[--bg-card] border border-[--border] rounded-lg shadow-lg z-20 overflow-hidden animate-in">
                <button
                  onClick={() => { onTest(connection); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[--text-secondary] hover:bg-[--accent]/5 transition-colors"
                >
                  <Play size={14} /> Probar conexión
                </button>
                <button
                  onClick={() => { copyUrl(); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[--text-secondary] hover:bg-[--accent]/5 transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copied ? '¡Copiado!' : 'Copiar URL'}
                </button>
                <div className="h-px bg-[--border] my-1" />
                <button
                  onClick={() => { onDelete(connection.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {connection.authType && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[--accent]/5 text-[--accent]/70 border border-[--accent]/10">
              <Key size={12} className="flex-shrink-0" />
              <span>{connection.authType}</span>
            </div>
          )}
          {connection.authHeader && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[--accent]/5 text-[--text-secondary] border border-[--accent]/10">
              <Globe size={12} className="flex-shrink-0" />
              <span className="truncate max-w-[150px]">{connection.authHeader}</span>
            </div>
          )}
          {connection.body && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Con Body</span>
            </div>
          )}
        </div>

          <div className="flex items-center justify-between pt-3 border-t border-[--border]">
          <div className="flex items-center gap-2 text-xs text-[--text-muted]">
            <div className="flex items-center gap-1.5 bg-[--accent]/5 px-2 py-1 rounded-md">
              <Clock size={11} />
              <span className="font-mono">{formatDate(connection.createdAt)}</span>
            </div>
          </div>
          {connection.authApiId && (
            <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-[--accent]/10 text-[--accent]/70 border border-[--accent]/15">
              <ExternalLink size={11} />
              <span className="font-mono">API #{connection.authApiId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
