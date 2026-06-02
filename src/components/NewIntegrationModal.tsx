import { useState } from 'react';
import { Plug, Loader2, GitMerge, ArrowRight } from 'lucide-react';
import { ApiConnection } from '../hooks/useApiConnections';
import { CreateIntegrationPayload } from '../hooks/useIntegrations';
import Modal from './ui/Modal';

interface Props {
  connections: ApiConnection[];
  onClose: () => void;
  onSuccess: (payload: CreateIntegrationPayload) => Promise<void>;
}

const methodColors: Record<string, string> = {
  GET: 'text-emerald-600',
  POST: 'text-[#5741d8]',
  PUT: 'text-amber-600',
  DELETE: 'text-red-500',
  PATCH: 'text-violet-600',
};

export default function NewIntegrationModal({ connections, onClose, onSuccess }: Props) {
  const [apiA, setApiA] = useState<number | null>(null);
  const [apiB, setApiB] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiA || !apiB || apiA === apiB) return;
    setLoading(true);
    setError(null);
    try {
      await onSuccess({ apiA, apiB, description });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear integración');
      setLoading(false);
    }
  };

  const selectedA = connections.find(c => c.id === apiA);
  const selectedB = connections.find(c => c.id === apiB);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Nueva Integración"
      subtitle="Conectar APIs"
      icon={<GitMerge size={15} />}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-[#5741d8]/[0.12] text-[#0a0a0a]/60 text-sm font-medium hover:bg-[#5741d8]/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!apiA || !apiB || apiA === apiB || loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-b from-[#5741d8] to-[#4635b5] hover:from-[#5d47e0] hover:to-[#4d39c4] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all shadow-[0_1px_2px_rgb(87_65_216/0.3)] hover:shadow-[0_2px_6px_rgb(87_65_216/0.35)] active:scale-[0.98]"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Plug size={15} />}
            {loading ? 'Creando...' : 'Crear Integración'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-[#0a0a0a]/60 mb-1.5">API Origen (A)</label>
          <select
            value={apiA ?? ''}
            onChange={(e) => setApiA(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-white border border-[#5741d8]/[0.12] rounded-lg px-3.5 py-2.5 text-sm text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#5741d8]/20 focus:border-[#5741d8]/40 transition-all cursor-pointer"
          >
            <option value="">Seleccionar API...</option>
            {connections.filter(c => c.id !== apiB).map(conn => (
              <option key={conn.id} value={conn.id}>
                {conn.description || `API ${conn.id}`} ({conn.method})
              </option>
            ))}
          </select>
          {selectedA && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-[#5741d8]/5 border border-[#5741d8]/10">
              <span className={`text-xs font-semibold ${methodColors[selectedA.method] || 'text-slate-500'}`}>
                {selectedA.method}
              </span>
              <span className="text-xs text-[#0a0a0a]/50 ml-2 font-mono">{selectedA.url}{selectedA.pathParams}</span>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5741d8]/10 border border-[#5741d8]/15">
            <ArrowRight size={14} className="text-[#5741d8]/50" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0a0a0a]/60 mb-1.5">API Destino (B)</label>
          <select
            value={apiB ?? ''}
            onChange={(e) => setApiB(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-white border border-[#5741d8]/[0.12] rounded-lg px-3.5 py-2.5 text-sm text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#5741d8]/20 focus:border-[#5741d8]/40 transition-all cursor-pointer"
          >
            <option value="">Seleccionar API...</option>
            {connections.filter(c => c.id !== apiA).map(conn => (
              <option key={conn.id} value={conn.id}>
                {conn.description || `API ${conn.id}`} ({conn.method})
              </option>
            ))}
          </select>
          {selectedB && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-[#5741d8]/5 border border-[#5741d8]/10">
              <span className={`text-xs font-semibold ${methodColors[selectedB.method] || 'text-slate-500'}`}>
                {selectedB.method}
              </span>
              <span className="text-xs text-[#0a0a0a]/50 ml-2 font-mono">{selectedB.url}{selectedB.pathParams}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-[#0a0a0a]/60 mb-1.5">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Sincronización CRM → ERP"
            className="w-full bg-white border border-[#5741d8]/[0.12] rounded-lg px-3.5 py-2.5 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/30 focus:outline-none focus:ring-2 focus:ring-[#5741d8]/20 focus:border-[#5741d8]/40 transition-all"
          />
        </div>
      </form>
    </Modal>
  );
}
