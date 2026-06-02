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
          className="p-2 rounded-lg bg-[#5741d8]/5 border border-[#5741d8]/[0.12] text-[#5741d8]/50 hover:text-[#5741d8]/70 hover:bg-white transition-colors">
          <RefreshCw size={16} />
        </button>
      </PageHeader>

      <div className="p-6">
        {loading ? <LoadingState message="Cargando integraciones..." /> : (
          <div className="bg-white rounded-xl border border-[#5741d8]/[0.08] overflow-hidden shadow-[0_1px_3px_0_rgb(87_65_216/0.04),0_1px_2px_-1px_rgb(87_65_216/0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#5741d8]/[0.06] bg-[#5741d8]/5">
                    {['ID', 'Descripción', 'API A', 'API B', 'Estado', 'Creado', 'Acciones'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#5741d8]/60 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#5741d8]/[0.06]">
                  {integrations.map(integration => {
                    const status = statusConfig[integration.status] || statusConfig.inactive;
                    return (
                      <tr key={integration.id} className="hover:bg-[#5741d8]/[0.02] transition-colors">
                        <td className="px-4 py-3 text-sm text-[#0a0a0a]/50 font-mono">#{integration.id}</td>
                        <td className="px-4 py-3 text-sm text-[#0a0a0a] font-medium">{integration.description || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-[#5741d8]/10 text-[#5741d8]">API {integration.apiA}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-[#5741d8]/10 text-[#5741d8]/70">API {integration.apiB}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium', status.bg, status.color)}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#0a0a0a]/40">{formatDate(integration.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded text-[#0a0a0a]/35 hover:text-[#5741d8]/60 hover:bg-[#5741d8]/5 transition-colors">
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
