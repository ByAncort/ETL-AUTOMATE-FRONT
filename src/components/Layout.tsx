import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import NewConnectionModal from './NewConnectionModal';
import SchemaMatcherModal from './SchemaMatcherModal';

type ModalType = 'none' | 'newConnection' | 'schemaMatcher';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Resumen de integraciones' },
  '/dashboard/connections': { title: 'Conexiones API', subtitle: 'Gestión de conexiones' },
  '/dashboard/explorer': { title: 'Explorador de Datos', subtitle: 'Explora tus fuentes de datos' },
  '/dashboard/settings': { title: 'Configuración', subtitle: 'Ajustes del sistema' },
  '/admin': { title: 'Panel de Administración', subtitle: 'Administración del sistema' },
  '/admin/users': { title: 'Gestión de Usuarios', subtitle: 'Administra usuarios' },
  '/admin/integrations': { title: 'Integraciones', subtitle: 'Configuración global' },
  '/admin/monitoring': { title: 'Monitoreo', subtitle: 'Estado del sistema' },
  '/admin/logs': { title: 'Logs del Sistema', subtitle: 'Registros de actividad' },
  '/admin/security': { title: 'Seguridad', subtitle: 'Configuración de seguridad' },
  '/admin/settings': { title: 'Configuración Admin', subtitle: 'Ajustes administrativos' },
};

export default function Layout() {
  const location = useLocation();
  const { logout } = useAuth();
  const [modal, setModal] = useState<ModalType>('none');
  
  const isAdminView = location.pathname.startsWith('/admin');
  const currentPage = pageTitles[location.pathname] || { title: 'ETL Automate', subtitle: 'Plataforma de Integración' };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] font-sans overflow-hidden">
      <Sidebar isAdminView={isAdminView} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          onNewIntegration={() => setModal('newConnection')}
          onLogout={logout}
        />
        
        <main className="flex-1 overflow-y-auto px-6 py-5">
          <Outlet />
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