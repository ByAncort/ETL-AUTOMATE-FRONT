import { useState } from 'react';
import { Plug, Plus, Search, RefreshCw } from 'lucide-react';
import { useApiConnections, ApiConnection, CreateConnectionPayload } from '../hooks/useApiConnections';
import { addNotification } from '../services/notificationService';
import ConnectionCard from '../components/connections/ConnectionCard';
import CreateConnectionModal from '../components/connections/CreateConnectionModal';
import TestResultDialog from '../components/connections/TestResultDialog';
import PageHeader from '../components/ui/PageHeader';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

export default function ConnectionsPage() {
  const { connections, loading, error, refetch, deleteConnection, createConnection, testConnection } = useApiConnections();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testResult, setTestResult] = useState<{ loading: boolean; result: Record<string, unknown> } | null>(null);

  const filteredConnections = connections.filter(conn => {
    const q = searchQuery.toLowerCase();
    return (conn.description?.toLowerCase().includes(q) || conn.url.toLowerCase().includes(q)) &&
      (filterMethod === 'all' || conn.method === filterMethod);
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar esta conexión?')) {
      await deleteConnection(id);
      addNotification('connection', 'Conexión eliminada', `La conexión #${id} ha sido eliminada`);
    }
  };

  const handleTest = async (connection: ApiConnection) => {
    setTestResult({ loading: true, result: {} });
    const result = await testConnection(connection);
    setTestResult({ loading: false, result });
  };

  const handleCreate = async (payload: CreateConnectionPayload) => {
    const result = await createConnection(payload);
    if (result.success) {
      setIsModalOpen(false);
      refetch();
      addNotification('connection', 'API conectada', payload.description || payload.url);
    }
  };

  const methods = ['all', ...Array.from(new Set(connections.map(c => c.method)))];

  return (
    <div>
      <PageHeader
        icon={<Plug size={16} />}
        title="Conexiones API"
        description={`${connections.length} ${connections.length === 1 ? 'conexión' : 'conexiones'} registradas`}
      >
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5741d8]/40" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..." className="bg-[#5741d8]/5 border border-[#5741d8]/[0.12] rounded-lg pl-9 pr-4 py-2 text-sm text-[#0a0a0a] placeholder:text-[#0a0a0a]/30 focus:outline-none focus:ring-2 focus:ring-[#5741d8]/20 focus:border-[#5741d8]/40 w-40 transition-all" />
        </div>
        <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}
          className="bg-[#5741d8]/5 border border-[#5741d8]/[0.12] rounded-lg px-3 py-2 text-sm text-[#0a0a0a]/70 focus:outline-none focus:ring-2 focus:ring-[#5741d8]/20 cursor-pointer">
          {methods.map(m => <option key={m} value={m}>{m === 'all' ? 'Todos' : m}</option>)}
        </select>
        <button onClick={refetch}
          className="p-2 rounded-lg bg-[#5741d8]/5 border border-[#5741d8]/[0.12] text-[#5741d8]/50 hover:text-[#5741d8]/70 hover:bg-white transition-colors">
          <RefreshCw size={16} />
        </button>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-b from-[#5741d8] to-[#4635b5] hover:from-[#5d47e0] hover:to-[#4d39c4] text-white rounded-lg text-sm font-semibold transition-all shadow-[0_1px_2px_rgb(87_65_216/0.3)] hover:shadow-[0_2px_6px_rgb(87_65_216/0.35)] active:scale-[0.98]">
          <Plus size={16} /> <span className="hidden sm:inline">Nueva</span>
        </button>
      </PageHeader>

      <div className="p-6">
        {loading ? <LoadingState message="Cargando conexiones..." icon={<Plug size={16} className="text-[#5741d8]" />} /> :
         error ? <ErrorState message={error} onRetry={refetch} /> :
         filteredConnections.length === 0 ? (
           <EmptyState icon={<Plug size={40} className="text-[#5741d8]/30" />}
             title="Sin conexiones" description="Crea tu primera conexión API para comenzar a integrar tus fuentes de datos."
             actionLabel="Nueva Conexión" onAction={() => setIsModalOpen(true)} />
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
             {filteredConnections.map(conn => (
               <ConnectionCard key={conn.id} connection={conn} onDelete={handleDelete} onTest={handleTest} />
             ))}
           </div>
         )}
      </div>

      <CreateConnectionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreate} />
      {testResult && <TestResultDialog testResult={testResult} onClose={() => setTestResult(null)} />}
    </div>
  );
}
