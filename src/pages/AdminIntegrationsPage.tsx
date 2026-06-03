import { GitMerge, RefreshCw, Globe } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import LoadingState from '../components/ui/LoadingState';
import { useIntegrations } from '../hooks/useIntegrations';
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

export default function AdminIntegrationsPage() {
  const { integrations, loading, refetch } = useIntegrations();

  return (
    <div>
      <PageHeader icon={<GitMerge size={16} />} title="Integraciones"
        description="Configuración global de integraciones">
        <button onClick={refetch}
          className="p-2 rounded-lg bg-[--accent]/5 border border-[--accent]/[0.12] text-[--accent]/50 hover:text-[--accent]/70 hover:bg-white transition-colors">
          <RefreshCw size={16} />
        </button>
      </PageHeader>

      <div className="p-6">
        {loading ? <LoadingState message="Cargando integraciones..." /> : (
          <div className="bg-white rounded-xl border border-[--accent]/[0.08] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[--accent]/[0.06] bg-[--accent]/5">
                    {['ID', 'Descripción', 'API A', 'API B', 'Estado', 'Creado', 'Acciones'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[--accent]/60 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--accent]/[0.06]">
                  {integrations.map(integration => {
                    const status = statusConfig[integration.status] || statusConfig.inactive;
                    return (
                      <tr key={integration.id} className="hover:bg-[--accent]/[0.02] transition-colors">
                        <td className="px-4 py-3 text-sm text-[#0a0a0a]/50 font-mono">#{integration.id}</td>
                        <td className="px-4 py-3 text-sm text-[#0a0a0a] font-medium">{integration.description || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-[--accent]/10 text-[--accent]">API {integration.apiA}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-[--accent]/10 text-[--accent]/70">API {integration.apiB}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium', status.bg, status.color)}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#0a0a0a]/40">{formatDate(integration.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded text-[#0a0a0a]/35 hover:text-[--accent]/60 hover:bg-[--accent]/5 transition-colors">
                              <Globe size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {integrations.length === 0 && (
              <div className="flex flex-col items-center py-12 text-[#0a0a0a]/35">
                <GitMerge size={40} className="mb-3 opacity-50" />
                <p className="text-sm">No hay integraciones configuradas</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
