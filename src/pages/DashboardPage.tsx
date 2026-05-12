import { useState } from 'react';
import { useIntegrations } from '../hooks/useIntegrations';
import { useUnifiedRecords } from '../hooks/useUnifiedRecords';
import StatsBar from '../components/StatsBar';
import IntegrationCard from '../components/IntegrationCard';
import UnifiedDataTable from '../components/UnifiedDataTable';
import NewConnectionModal from '../components/NewConnectionModal';
import SchemaMatcherModal from '../components/SchemaMatcherModal';

type ModalType = 'none' | 'newConnection' | 'schemaMatcher';

export default function DashboardPage() {
  const [modal, setModal] = useState<ModalType>('none');
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<number | null>(null);
  const { integrations, loading: loadingIntegrations } = useIntegrations();
  const { records, loading: loadingRecords } = useUnifiedRecords();

  return (
    <>
      <div className="mb-5">
        <StatsBar />
      </div>
      
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Integraciones Configuradas</h2>
          <span className="text-xs text-[var(--text-muted)]">{integrations.length} pipelines</span>
        </div>
        {loadingIntegrations ? (
          <p className="text-[var(--text-muted)] text-sm">Cargando integraciones...</p>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onSchemaMatch={() => {
                  setSelectedIntegrationId(Number(integration.id));
                  setModal('schemaMatcher');
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {loadingRecords ? (
        <p className="text-[var(--text-muted)] text-sm mt-4">Cargando registros...</p>
      ) : (
        <UnifiedDataTable records={records} />
      )}

      {modal === 'newConnection' && (
        <NewConnectionModal
          onClose={() => setModal('none')}
          onSuccess={() => setModal('schemaMatcher')}
        />
      )}

      {modal === 'schemaMatcher' && selectedIntegrationId && (
        <SchemaMatcherModal
          integrationId={selectedIntegrationId}
          onClose={() => setModal('none')}
        />
      )}
    </>
  );
}