import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import NewIntegrationModal from './NewIntegrationModal';
import { useApiConnections } from '../hooks/useApiConnections';
import { useIntegrations, CreateIntegrationPayload } from '../hooks/useIntegrations';
import { addNotification } from '../services/notificationService';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Resumen de integraciones' },
  '/dashboard/connections': { title: 'Conexiones API', subtitle: 'Gestión de conexiones' },
  '/dashboard/explorer': { title: 'Explorador de Datos', subtitle: 'Explora tus fuentes de datos' },
  '/dashboard/settings': { title: 'Configuración', subtitle: 'Ajustes del sistema' },
  '/dashboard/integrations': { title: 'Integraciones', subtitle: 'Pipelines de datos' },
  '/dashboard/profile': { title: 'Perfil de Usuario', subtitle: 'Edita tus datos personales y contraseña' },
  '/admin': { title: 'Panel de Administración', subtitle: 'Administración del sistema' },
  '/admin/users': { title: 'Gestión de Usuarios', subtitle: 'Administra usuarios' },
  '/admin/integrations': { title: 'Integraciones', subtitle: 'Configuración global' },
  '/admin/monitoring': { title: 'Monitoreo', subtitle: 'Estado del sistema' },
  '/admin/llm-configs': { title: 'Configuración LLM', subtitle: 'Modelos de lenguaje configurados' },
  '/admin/logs': { title: 'Logs del Sistema', subtitle: 'Registros de actividad' },
  '/admin/settings': { title: 'Configuración Admin', subtitle: 'Ajustes administrativos' },
};

export default function Layout() {
  const location = useLocation();
  const { logout } = useAuth();
  const { connections } = useApiConnections();
  const { createIntegration, refetch: refetchIntegrations } = useIntegrations();
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);

  const currentPage = pageMeta[location.pathname] || { title: 'ETL Automate', subtitle: 'Plataforma de Integración' };

  const handleCreateIntegration = async (payload: CreateIntegrationPayload) => {
    const result = await createIntegration(payload);
    if (result.success) {
      setShowIntegrationModal(false);
      refetchIntegrations();
      addNotification('integration', 'Integración creada', payload.description || `Conexión entre API #${payload.apiA} y #${payload.apiB}`);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          onNewIntegration={() => setShowIntegrationModal(true)}
          onLogout={logout}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      {showIntegrationModal && (
        <NewIntegrationModal
          connections={connections}
          onClose={() => setShowIntegrationModal(false)}
          onSuccess={handleCreateIntegration}
        />
      )}
    </div>
  );
}
