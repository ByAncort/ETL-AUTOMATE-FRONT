import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import IntegrationCard from './components/IntegrationCard';
import UnifiedDataTable from './components/UnifiedDataTable';
import NewConnectionModal from './components/NewConnectionModal';
import SchemaMatcherModal from './components/SchemaMatcherModal';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import { useAuth } from './context/AuthContext';
import { useIntegrations } from './hooks/useIntegrations';
import { useUnifiedRecords } from './hooks/useUnifiedRecords';

type ModalType = 'none' | 'newConnection' | 'schemaMatcher';

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  const [modal, setModal] = useState<ModalType>('none');
  const [isAdminView, setIsAdminView] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const { integrations, loading: loadingIntegrations } = useIntegrations();
  const { records, loading: loadingRecords } = useUnifiedRecords();

  if (!isAuthenticated) {
    if (isRegistering) {
      return <Register onToggleForm={() => setIsRegistering(false)} />;
    }
    return <Login onToggleForm={() => setIsRegistering(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#080d14] font-sans overflow-hidden">
      <Sidebar isAdminView={isAdminView} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          onNewIntegration={() => setModal('newConnection')}
          onLogout={logout}
        />
        
        <main className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {isAdminView ? (
            <AdminPanel />
          ) : (
            <>
              <StatsBar />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-300">Integraciones Configuradas</h2>
                  <span className="text-xs text-gray-600">{integrations.length} pipelines</span>
                </div>
                {loadingIntegrations ? (
                  <p className="text-gray-500 text-sm">Cargando integraciones...</p>
                ) : (
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {integrations.map((integration) => (
                      <IntegrationCard
                        key={integration.id}
                        integration={integration}
                        onSchemaMatch={() => setModal('schemaMatcher')}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {loadingRecords ? (
                <p className="text-gray-500 text-sm mt-4">Cargando registros...</p>
              ) : (
                <UnifiedDataTable records={records} />
              )}
            </>
          )}
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