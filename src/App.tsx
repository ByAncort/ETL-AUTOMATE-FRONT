// App.tsx
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import IntegrationCard from './components/IntegrationCard';
import UnifiedDataTable from './components/UnifiedDataTable';
import NewConnectionModal from './components/NewConnectionModal';
import SchemaMatcherModal from './components/SchemaMatcherModal';
import Login from './components/Login';
import { integrations, unifiedRecords } from './data/mockData';

type ModalType = 'none' | 'newConnection' | 'schemaMatcher';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modal, setModal] = useState<ModalType>('none');

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  // Si está autenticado, mostrar el dashboard
  return (
    <div className="flex h-screen bg-[#080d14] font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          onNewIntegration={() => setModal('newConnection')}
          onLogout={() => setIsAuthenticated(false)}
        />
        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <StatsBar />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-300">Integraciones Configuradas</h2>
              <span className="text-xs text-gray-600">{integrations.length} pipelines</span>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {integrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onSchemaMatch={() => setModal('schemaMatcher')}
                />
              ))}
            </div>
          </div>

          <UnifiedDataTable records={unifiedRecords} />

          <div className="h-4" />
        </main>
      </div>

      {modal === 'newConnection' && (
        <NewConnectionModal
          onClose={() => setModal('none')}
          onSuccess={() => setModal('schemaMatcher')}
        />
      )}

      {modal === 'schemaMatcher' && (
        <SchemaMatcherModal onClose={() => setModal('none')} />
      )}
    </div>
  );
}