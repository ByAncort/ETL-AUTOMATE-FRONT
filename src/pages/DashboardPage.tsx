import { useState } from 'react';
import { useIntegrations } from '../hooks/useIntegrations';
import { useUnifiedRecords } from '../hooks/useUnifiedRecords';
import StatsBar from '../components/StatsBar';
import IntegrationCard from '../components/IntegrationCard';
import SchemaMatcherModal from '../components/SchemaMatcherModal';
import UnifiedDataTable from '../components/UnifiedDataTable';
import LoadingState from '../components/ui/LoadingState';

export default function DashboardPage() {
  const { integrations, loading: loadingIntegrations } = useIntegrations();
  const { records, loading: loadingRecords } = useUnifiedRecords();
  const [schemaMatchId, setSchemaMatchId] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-6">
      <StatsBar />

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#0a0a0a]/70">Integraciones Configuradas</h2>
          <span className="text-xs text-[#0a0a0a]/40">{integrations.length} pipelines</span>
        </div>
        {loadingIntegrations ? (
          <LoadingState message="Cargando integraciones..." />
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onSchemaMatch={(id) => setSchemaMatchId(id)}
              />
            ))}
          </div>
        )}
      </div>

      {loadingRecords ? (
        <LoadingState message="Cargando registros..." />
      ) : (
        <UnifiedDataTable records={records} />
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
