import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ConnectionsPage from './pages/ConnectionsPage';
import Layout from './components/Layout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
      } />
      
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/connections" element={<ConnectionsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} />
    </Routes>
  );
}