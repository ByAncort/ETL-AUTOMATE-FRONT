import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitMerge,
  Plus,
  Search,
  Trash2,
  Edit3,
  X,
  Save,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import { useIntegrations } from '../hooks/useIntegrations';
import { useApiConnections } from '../hooks/useApiConnections';
import { IntegrationResponse } from '../types';

const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
  active: { color: 'text-emerald-400', bg: 'bg-emerald-400', border: 'border-emerald-500/30', label: 'Activo' },
  pending: { color: 'text-amber-400', bg: 'bg-amber-400', border: 'border-amber-500/30', label: 'Pendiente' },
  error: { color: 'text-red-400', bg: 'bg-red-400', border: 'border-red-500/30', label: 'Error' },
  inactive: { color: 'text-gray-500', bg: 'bg-gray-500', border: 'border-gray-600/30', label: 'Inactivo' },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

interface IntegrationCardProps {
  integration: IntegrationResponse;
  connections: { id: number; description: string; method: string }[];
  onEdit: (integration: IntegrationResponse) => void;
  onDelete: (id: number) => void;
}

function IntegrationCard({ integration, connections, onEdit, onDelete }: IntegrationCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const status = statusConfig[integration.status] || statusConfig.inactive;

  const apiAConn = connections.find(c => c.id === integration.apiA);
  const apiBConn = connections.find(c => c.id === integration.apiB);

  return (
    <div className="group relative bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:border-blue-500/30 transition-all">
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-[var(--text-primary)] font-semibold text-sm leading-tight truncate">
              {integration.description || `Integración ${integration.id}`}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${status.color} ${status.bg}/20 ${status.border}`}>
                {status.label}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <MoreVertical size={14} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-xl overflow-hidden z-20">
                <button
                  onClick={() => { onEdit(integration); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Edit3 size={12} />
                  Editar
                </button>
                <button
                  onClick={() => { onDelete(integration.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-[var(--text-muted)] mb-1">ORIGEN (A)</div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-blue-400">{apiAConn?.method || 'API'}</span>
              <span className="text-xs text-[var(--text-secondary)] truncate">
                {apiAConn?.description || `ID: ${integration.apiA}`}
              </span>
            </div>
          </div>

          <ArrowRight size={14} className="text-[var(--text-muted)] flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-[var(--text-muted)] mb-1">DESTINO (B)</div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-cyan-400">{apiBConn?.method || 'API'}</span>
              <span className="text-xs text-[var(--text-secondary)] truncate">
                {apiBConn?.description || `ID: ${integration.apiB}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 text-xs text-[var(--text-muted)]">
          <Clock size={10} />
          <span>{formatDate(integration.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

interface EditModalProps {
  integration: IntegrationResponse;
  onClose: () => void;
  onSave: (id: number, data: { description: string; status: string }) => Promise<void>;
}

function EditIntegrationModal({ integration, onClose, onSave }: EditModalProps) {
  const [description, setDescription] = useState(integration.description);
  const [status, setStatus] = useState(integration.status);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(integration.id, { description, status });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30">
              <Edit3 size={15} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-[var(--text-primary)] font-semibold text-sm">Editar Integración</h2>
              <p className="text-xs text-[var(--text-muted)]">ID: {integration.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Descripción</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500/60 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-blue-500/60 transition-all cursor-pointer"
            >
              <option value="active">Activo</option>
              <option value="pending">Pendiente</option>
              <option value="inactive">Inactivo</option>
              <option value="error">Error</option>
            </select>
          </div>
        </form>

        <div className="flex gap-3 px-6 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] text-sm font-medium hover:bg-[var(--bg-tertiary)] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={15} />
                Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 size={32} className="text-blue-400 animate-spin" />
      <p className="text-[var(--text-muted)] mt-4 text-sm">Cargando integraciones...</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="text-red-400" size={32} />
      </div>
      <p className="text-[var(--text-secondary)] text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <RefreshCw size={14} />
        Reintentar
      </button>
    </div>
  );
}

function EmptyState({ onAddNew }: { onAddNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center justify-center mb-6">
        <GitMerge className="text-[var(--text-muted)]" size={40} />
      </div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Sin integraciones</h3>
      <p className="text-[var(--text-muted)] text-sm mb-6 text-center max-w-sm">
        Crea tu primera integración para conectar APIs y comenzar a sincronizar datos.
      </p>
      <button
        onClick={onAddNew}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <Plus size={16} />
        Nueva Integración
      </button>
    </div>
  );
}

export default function IntegrationsPage() {
  const { integrations, loading, error, refetch, updateIntegration, deleteIntegration } = useIntegrations();
  const { connections } = useApiConnections();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIntegration, setEditingIntegration] = useState<IntegrationResponse | null>(null);

  const filteredIntegrations = integrations.filter(conn => {
    const matchesSearch = conn.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta integración?')) {
      await deleteIntegration(id);
    }
  };

  const handleSave = async (id: number, data: { description: string; status: string }) => {
    const result = await updateIntegration(id, { description: data.description, status: data.status as any });
    if (result.success) {
      setEditingIntegration(null);
    }
  };

  const connectionsMap = connections.map(c => ({
    id: c.id,
    description: c.description || `API ${c.id}`,
    method: c.method
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                <GitMerge className="text-blue-400" size={28} />
                Integraciones
              </h1>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {integrations.length} {integrations.length === 1 ? 'integración' : 'integraciones'} configuradas
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar integraciones..."
                  className="bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 w-48 transition-all"
                />
              </div>

              <button
                onClick={refetch}
                className="p-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                aria-label="Actualizar"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filteredIntegrations.length === 0 ? (
          <EmptyState onAddNew={() => {}} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredIntegrations.map(integration => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                connections={connectionsMap}
                onEdit={setEditingIntegration}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {editingIntegration && (
        <EditIntegrationModal
          integration={editingIntegration}
          onClose={() => setEditingIntegration(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
