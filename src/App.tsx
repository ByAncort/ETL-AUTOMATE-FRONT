import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ConnectionsPage from './pages/ConnectionsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import DataExplorerPage from './pages/DataExplorerPage';
import AdminIntegrationsPage from './pages/AdminIntegrationsPage';
import MonitoringPage from './pages/MonitoringPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminLlmConfigsPage from './pages/AdminLlmConfigsPage';
import Layout from './components/Layout';
import UsersManagement from './components/UsersManagement';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
      } />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/connections" element={<ConnectionsPage />} />
        <Route path="/dashboard/integrations" element={<IntegrationsPage />} />
        <Route path="/dashboard/explorer" element={<DataExplorerPage />} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><UsersManagement /></AdminRoute>} />
        <Route path="/admin/integrations" element={<AdminRoute><AdminIntegrationsPage /></AdminRoute>} />
        <Route path="/admin/monitoring" element={<AdminRoute><MonitoringPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
        <Route path="/admin/llm-configs" element={<AdminRoute><AdminLlmConfigsPage /></AdminRoute>} />
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} />
    </Routes>
  );
}
