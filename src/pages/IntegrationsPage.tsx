import { useState } from 'react';
import { GitMerge, Play, RefreshCw, Loader2, RotateCcw } from 'lucide-react';
import { useIntegrations } from '../hooks/useIntegrations';
import { useApiConnections } from '../hooks/useApiConnections';
import { runEtlById } from '../services/etlService';
import { runMatching } from '../services/schemaMatchService';
import { addNotification } from '../services/notificationService';
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

function IntegrationCard({ integration, connections, onEdit, onDelete, onSchemaMatch, onRunEtl, onRunMatching, running, matching }: {
  integration: IntegrationResponse;
  connections: { id: number; description: string; method: string }[];
  onEdit: (i: IntegrationResponse) => void;
  onDelete: (id: number) => void;
  onSchemaMatch: (id: number) => void;
  onRunEtl: (id: number) => void;
  onRunMatching?: (id: number) => void;
  running?: boolean;
  matching?: boolean;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const status = statusConfig[integration.status] || statusConfig.inactive;
  const apiA = connections.find(c => c.id === integration.apiA);
  const apiB = connections.find(c => c.id === integration.apiB);

  return (
    <div className="bg-white border border-[#5741d8]/[0.08] rounded-xl hover:border-[#5741d8]/30 hover:shadow-[0_1px_8px_-2px_rgba(87,65,216,0.08)] transition-all">
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-[#0a0a0a] font-semibold text-sm truncate">
              {integration.description || `Integración ${integration.id}`}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              {matching ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-50 text-violet-700">
                  <Loader2 size={10} className="animate-spin" /> Matching...
                </span>
              ) : running ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                  <Loader2 size={10} className="animate-spin" /> Ejecutando
                </span>
              ) : (
                <span className={cn('px-2 py-0.5 rounded text-[10px] font-semibold', status.bg, status.color)}>
                  {status.label}
                </span>
              )}
            </div>
          </div>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-[#0a0a0a]/35 hover:text-[#5741d8]/60 hover:bg-[#5741d8]/5 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#5741d8]/[0.08] rounded-lg shadow-lg z-20 overflow-hidden">
                <button onClick={() => { onRunMatching?.(integration.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-violet-600 hover:bg-violet-50 font-medium">
                  <RotateCcw size={12} /> Re-ejecutar Matching
                </button>
                <button onClick={() => { onRunEtl(integration.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#5741d8] hover:bg-[#5741d8]/5 font-medium">
                  <Play size={12} /> Ejecutar ETL
                </button>
                <button onClick={() => { onSchemaMatch(integration.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0a0a0a]/70 hover:bg-[#5741d8]/5">
                  Ver Mapeo
                </button>
                <button onClick={() => { onEdit(integration); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0a0a0a]/70 hover:bg-[#5741d8]/5">
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

        <div className="flex items-center gap-3 p-3 rounded-lg bg-[#5741d8]/5 border border-[#5741d8]/10">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-[#5741d8]/50 mb-1 font-medium">ORIGEN (A)</div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#5741d8]">{apiA?.method || 'API'}</span>
              <span className="text-xs text-[#0a0a0a]/50 truncate">{apiA?.description || `ID: ${integration.apiA}`}</span>
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#5741d8]/30 flex-shrink-0">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-[#5741d8]/50 mb-1 font-medium">DESTINO (B)</div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#5741d8]/70">{apiB?.method || 'API'}</span>
              <span className="text-xs text-[#0a0a0a]/50 truncate">{apiB?.description || `ID: ${integration.apiB}`}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 text-xs text-[#0a0a0a]/40">
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
            className="flex-1 py-2.5 rounded-lg border border-[#5741d8]/[0.12] text-[#0a0a0a]/60 text-sm font-medium hover:bg-[#5741d8]/5 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-b from-[#5741d8] to-[#4635b5] hover:from-[#5d47e0] hover:to-[#4d39c4] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-[0_1px_2px_rgb(87_65_216/0.3)] hover:shadow-[0_2px_6px_rgb(87_65_216/0.35)] active:scale-[0.98]">
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </>
      }>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#0a0a0a]/60 mb-1.5">API Origen (A)</label>
          <select value={apiA} onChange={(e) => { const val = Number(e.target.value); setApiA(val); }}
            className="w-full bg-white border border-[#5741d8]/[0.12] rounded-lg px-3.5 py-2.5 text-sm text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#5741d8]/20 focus:border-[#5741d8]/40 transition-all cursor-pointer">
            {connections.map(c => (
              <option key={c.id} value={c.id}>{c.description} ({c.method})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#0a0a0a]/60 mb-1.5">API Destino (B)</label>
          <select value={apiB} onChange={(e) => setApiB(Number(e.target.value))}
            className="w-full bg-white border border-[#5741d8]/[0.12] rounded-lg px-3.5 py-2.5 text-sm text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#5741d8]/20 focus:border-[#5741d8]/40 transition-all cursor-pointer">
            {otherConnections.map(c => (
              <option key={c.id} value={c.id}>{c.description} ({c.method})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#0a0a0a]/60 mb-1.5">Descripción</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-[#5741d8]/[0.12] rounded-lg px-3.5 py-2.5 text-sm text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#5741d8]/20 focus:border-[#5741d8]/40 transition-all" />
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
  const [runningEtlId, setRunningEtlId] = useState<number | null>(null);
  const [matchingId, setMatchingId] = useState<number | null>(null);

  const handleRunMatching = async (id: number) => {
    setMatchingId(id);
    try {
      await runMatching(id);
      addNotification('success', 'Matching ejecutado', `Integración #${id}`);
    } catch {
      addNotification('error', 'Error en matching', `No se pudo ejecutar matching en integración #${id}`);
    } finally {
      setMatchingId(null);
    }
  };

  const handleRunEtl = async (id: number) => {
    setRunningEtlId(id);
    try {
      const result = await runEtlById(id);
      if (result.errors?.length > 0) {
        addNotification('error', 'ETL con errores', `Integración #${id} — ${result.errors.length} error(es)`);
      } else {
        addNotification('success', 'ETL ejecutado', `Integración #${id} — ${result.loadedRecords} registros cargados`);
      }
    } catch {
      addNotification('error', 'Error en ETL', `No se pudo ejecutar ETL en integración #${id}`);
    } finally {
      setRunningEtlId(null);
    }
  };

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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0a0a0a]/35">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..." className="bg-[#5741d8]/5 border border-[#5741d8]/[0.12] rounded-lg pl-9 pr-4 py-2 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/30 focus:outline-none focus:ring-2 focus:ring-[#5741d8]/20 focus:border-[#5741d8]/40 w-44 transition-all" />
        </div>
        <button onClick={refetch}
          className="p-2 rounded-lg bg-[#5741d8]/5 border border-[#5741d8]/[0.12] text-[#5741d8]/50 hover:text-[#5741d8]/70 hover:bg-white transition-colors">
          <RefreshCw size={16} />
        </button>
      </PageHeader>

      <div className="p-6">
        {loading ? <LoadingState message="Cargando integraciones..." /> :
         error ? <ErrorState message={error} onRetry={refetch} /> :
         filtered.length === 0 ? (
           <EmptyState icon={<GitMerge size={40} className="text-[#5741d8]/30" />}
             title="Sin integraciones" description="Crea tu primera integración para conectar APIs."
             actionLabel="Nueva Integración" onAction={() => {}} />
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(i => (
                <IntegrationCard key={i.id} integration={i} connections={connMap}
                  onEdit={setEditingIntegration} onDelete={handleDelete}
                  onSchemaMatch={setSchemaMatchId} onRunEtl={handleRunEtl}
                  onRunMatching={handleRunMatching}
                  running={runningEtlId === i.id} matching={matchingId === i.id} />
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
