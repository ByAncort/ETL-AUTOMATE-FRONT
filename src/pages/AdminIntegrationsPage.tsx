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
          className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-white transition-colors">
          <RefreshCw size={16} />
        </button>
      </PageHeader>

      <div className="p-6">
        {loading ? <LoadingState message="Cargando integraciones..." /> : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['ID', 'Descripción', 'API A', 'API B', 'Estado', 'Creado', 'Acciones'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {integrations.map(integration => {
                    const status = statusConfig[integration.status] || statusConfig.inactive;
                    return (
                      <tr key={integration.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-slate-500 font-mono">#{integration.id}</td>
                        <td className="px-4 py-3 text-sm text-slate-900 font-medium">{integration.description || '—'}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-blue-50 text-blue-700">API {integration.apiA}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-mono bg-cyan-50 text-cyan-700">API {integration.apiB}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium', status.bg, status.color)}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{formatDate(integration.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
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
              <div className="flex flex-col items-center py-12 text-slate-400">
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
