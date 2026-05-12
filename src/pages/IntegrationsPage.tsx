import { useState } from 'react';
import { GitMerge, RefreshCw } from 'lucide-react';
import { useIntegrations } from '../hooks/useIntegrations';
import { useApiConnections } from '../hooks/useApiConnections';
import { IntegrationResponse } from '../types';
import PageHeader from '../components/ui/PageHeader';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import SchemaMatcherModal from '../components/SchemaMatcherModal';
import { cn } from '../lib/utils';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  active: { color: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Activo' },
  pending: { color: 'text-amber-700', bg: 'bg-amber-100', label: 'Pendiente' },
  error: { color: 'text-red-700', bg: 'bg-red-100', label: 'Error' },
  inactive: { color: 'text-slate-500', bg: 'bg-slate-100', label: 'Inactivo' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function IntegrationCard({ integration, connections, onEdit, onDelete, onSchemaMatch }: {
  integration: IntegrationResponse;
  connections: { id: number; description: string; method: string }[];
  onEdit: (i: IntegrationResponse) => void;
  onDelete: (id: number) => void;
  onSchemaMatch: (id: number) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const status = statusConfig[integration.status] || statusConfig.inactive;
  const apiA = connections.find(c => c.id === integration.apiA);
  const apiB = connections.find(c => c.id === integration.apiB);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all">
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-slate-900 font-semibold text-sm truncate">
              {integration.description || `Integración ${integration.id}`}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold', status.bg, status.color)}>
                {status.label}
              </span>
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 overflow-hidden">
                <button onClick={() => { onSchemaMatch(integration.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  Ver Mapeo
                </button>
                <button onClick={() => { onEdit(integration); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  Editar
                </button>
                <button onClick={() => { onDelete(integration.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-slate-500 mb-1">ORIGEN (A)</div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-blue-600">{apiA?.method || 'API'}</span>
              <span className="text-xs text-slate-500 truncate">{apiA?.description || `ID: ${integration.apiA}`}</span>
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-slate-500 mb-1">DESTINO (B)</div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-cyan-600">{apiB?.method || 'API'}</span>
              <span className="text-xs text-slate-500 truncate">{apiB?.description || `ID: ${integration.apiB}`}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
          <span>{formatDate(integration.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function EditModal({ integration, connections, onClose, onSave }: {
  integration: IntegrationResponse;
  connections: { id: number; description: string; method: string }[];
  onClose: () => void;
  onSave: (id: number, data: { apiA: number; apiB: number; description: string }) => Promise<void>;
}) {
  const [apiA, setApiA] = useState(integration.apiA);
  const [apiB, setApiB] = useState(integration.apiB);
  const [description, setDescription] = useState(integration.description);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onSave(integration.id, { apiA, apiB, description }); } finally { setLoading(false); }
  };

  const otherConnections = connections.filter(c => c.id !== apiA);

  return (
    <Modal isOpen onClose={onClose} title="Editar Integración" subtitle={`ID: ${integration.id}`}
      icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
      footer={
        <>
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      }>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">API Origen (A)</label>
          <select value={apiA} onChange={(e) => { const val = Number(e.target.value); setApiA(val); }}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer">
            {connections.map(c => (
              <option key={c.id} value={c.id}>{c.description} ({c.method})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">API Destino (B)</label>
          <select value={apiB} onChange={(e) => setApiB(Number(e.target.value))}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer">
            {otherConnections.map(c => (
              <option key={c.id} value={c.id}>{c.description} ({c.method})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Descripción</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
        </div>
      </form>
    </Modal>
  );
}

export default function IntegrationsPage() {
  const { integrations, loading, error, refetch, updateIntegration, deleteIntegration } = useIntegrations();
  const { connections } = useApiConnections();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingIntegration, setEditingIntegration] = useState<IntegrationResponse | null>(null);
  const [schemaMatchId, setSchemaMatchId] = useState<number | null>(null);

  const filtered = integrations.filter(i =>
    i.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta integración?')) {
      await deleteIntegration(id);
    }
  };

  const handleSave = async (id: number, data: { apiA: number; apiB: number; description: string }) => {
    const result = await updateIntegration(id, {
      apiA: data.apiA, apiB: data.apiB, description: data.description,
    });
    if (result.success) setEditingIntegration(null);
  };

  const connMap = connections.map(c => ({ id: c.id, description: c.description || `API ${c.id}`, method: c.method }));

  return (
    <div>
      <PageHeader icon={<GitMerge size={16} />} title="Integraciones"
        description={`${integrations.length} ${integrations.length === 1 ? 'integración' : 'integraciones'} configuradas`}>
        <div className="relative">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..." className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 w-44 transition-all" />
        </div>
        <button onClick={refetch}
          className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-white transition-colors">
          <RefreshCw size={16} />
        </button>
      </PageHeader>

      <div className="p-6">
        {loading ? <LoadingState message="Cargando integraciones..." /> :
         error ? <ErrorState message={error} onRetry={refetch} /> :
         filtered.length === 0 ? (
           <EmptyState icon={<GitMerge size={40} className="text-slate-300" />}
             title="Sin integraciones" description="Crea tu primera integración para conectar APIs."
             actionLabel="Nueva Integración" onAction={() => {}} />
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
             {filtered.map(i => (
               <IntegrationCard key={i.id} integration={i} connections={connMap}
                 onEdit={setEditingIntegration} onDelete={handleDelete}
                 onSchemaMatch={setSchemaMatchId} />
             ))}
           </div>
         )}
      </div>

      {editingIntegration && (
        <EditModal integration={editingIntegration} connections={connMap}
          onClose={() => setEditingIntegration(null)} onSave={handleSave} />
      )}

      {schemaMatchId !== null && (
        <SchemaMatcherModal
          integrationId={schemaMatchId}
          onClose={() => setSchemaMatchId(null)}
        />
      )}
    </div>
  );
}
