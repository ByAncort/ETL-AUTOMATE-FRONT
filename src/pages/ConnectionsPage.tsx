import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plug, 
  Plus, 
  Search, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check,
  MoreVertical,
  Globe,
  Key,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
  Save,
  Play,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useApiConnections, ApiConnection, CreateConnectionPayload } from '../hooks/useApiConnections';
import { addNotification } from '../services/notificationService';

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const authTypeColors: Record<string, { bg: string; text: string }> = {
  BEARER: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  BASIC: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  API_KEY: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  NONE: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function truncateUrl(url: string, maxLength: number = 40): string {
  if (url.length <= maxLength) return url;
  return url.substring(0, maxLength) + '...';
}

interface ConnectionCardProps {
  connection: ApiConnection;
  onDelete: (id: number) => void;
  onTest: (connection: ApiConnection) => void;
}

function ConnectionCard({ connection, onDelete, onTest }: ConnectionCardProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const methodClass = methodColors[connection.method] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  const authStyle = authTypeColors[connection.authType] || { bg: 'bg-gray-500/10', text: 'text-gray-400' };

  const copyUrl = () => {
    navigator.clipboard.writeText(connection.url + (connection.pathParams || ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fullUrl = connection.url + (connection.pathParams || '');

  return (
<div 
  className="group relative bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#58a6ff]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-0.5"
  role="article"
  aria-label={`Conexión ${connection.description || connection.id}`}
>
  {/* Gradient accent line on top */}
  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

  <div className="p-5">
    {/* Header Section */}
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border-2 transition-all duration-200 ${methodClass} shadow-sm`}>
          {connection.method}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 truncate">
            {connection.description || `Conexión ${connection.id}`}
          </h3>
          <p className="text-xs text-gray-400 truncate mt-1 font-mono" title={fullUrl}>
            {truncateUrl(fullUrl)}
          </p>
        </div>
      </div>

      {/* Actions Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-all duration-200 hover:scale-105"
          aria-label="Más opciones"
        >
          <MoreVertical size={16} />
        </button>
        
        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-44 bg-[#0d1117] border border-[#30363d] rounded-lg shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => { onTest(connection); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1f242f] hover:text-white transition-colors group/item"
            >
              <ExternalLink size={14} className="group-hover/item:scale-110 transition-transform" />
              Probar conexión
            </button>
            <button
              onClick={() => { copyUrl(); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#1f242f] hover:text-white transition-colors group/item"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="group-hover/item:scale-110 transition-transform" />}
              {copied ? '¡Copiado!' : 'Copiar URL'}
            </button>
            <div className="h-px bg-[#21262d] my-1" />
            <button
              onClick={() => { onDelete(connection.id); setShowMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors group/item"
            >
              <Trash2 size={14} className="group-hover/item:scale-110 transition-transform" />
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>

    {/* Tags Section */}
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {connection.authType && (
        <div className={`group/tag flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${authStyle.bg} ${authStyle.text} shadow-sm transition-all duration-200 hover:scale-105`}>
          <Key size={12} className="flex-shrink-0" />
          <span>{connection.authType}</span>
        </div>
      )}
      
      {connection.authHeader && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1c2128] text-gray-300 border border-[#30363d]">
          <Globe size={12} className="flex-shrink-0" />
          <span className="truncate max-w-[150px]">{connection.authHeader}</span>
        </div>
      )}

      {connection.body && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Con Body</span>
        </div>
      )}
    </div>

    {/* Footer Section */}
    <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5 bg-[#1c2128] px-2 py-1 rounded-md">
          <Clock size={11} />
          <span className="font-mono">{formatDate(connection.createdAt)}</span>
        </div>
      </div>

      {connection.authApiId && (
        <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <ExternalLink size={11} />
          <span className="font-mono">API #{connection.authApiId}</span>
        </div>
      )}
    </div>
  </div>
</div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#21262d] border-t-blue-500 animate-spin" />
        <Plug className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" size={20} />
      </div>
      <p className="text-gray-400 mt-4 text-sm">Cargando conexiones...</p>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="text-red-400" size={32} />
      </div>
      <p className="text-gray-300 text-sm mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <RefreshCw size={14} />
        Reintentar
      </button>
    </div>
  );
}

function EmptyState({ onAddNew }: { onAddNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center mb-6">
        <Plug className="text-gray-500" size={40} />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Sin conexiones</h3>
      <p className="text-gray-500 text-sm mb-6 text-center max-w-sm">
        Crea tu primera conexión API para comenzar a integrar tus fuentes de datos.
      </p>
      <button
        onClick={onAddNew}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        <Plus size={16} />
        Nueva Conexión
      </button>
    </div>
  );
}

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateConnectionPayload) => Promise<void>;
}

function CreateConnectionModal({ isOpen, onClose, onSubmit }: CreateModalProps) {
  const [formData, setFormData] = useState({
    method: 'GET',
    url: '',
    pathParams: '',
    description: '',
    authType: 'BEARER',
    authHeader: 'Authorization',
    body: '',
    authValue: '',
    hasApiAuth: false,
    apiAuthMethod: 'GET',
    apiAuthUrl: '',
    apiAuthPathParams: '',
    apiAuthDescription: '',
    apiAuthAuthType: 'BEARER',
    apiAuthAuthHeader: 'Authorization',
    apiAuthAuthValue: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const payload: CreateConnectionPayload = {
      method: formData.method,
      url: formData.url,
      pathParams: formData.pathParams,
      description: formData.description,
      authType: formData.authType,
      authHeader: formData.authHeader,
      body: formData.body || undefined,
      authValue: formData.authValue || undefined
    };

    if (formData.hasApiAuth) {
      payload.apiAuth = {
        method: formData.apiAuthMethod,
        url: formData.apiAuthUrl,
        pathParams: formData.apiAuthPathParams,
        description: formData.apiAuthDescription,
        authType: formData.apiAuthAuthType,
        authHeader: formData.apiAuthAuthHeader,
        authValue: formData.apiAuthAuthValue
      };
    }

    await onSubmit(payload);
    setIsSubmitting(false);
  };

  const inputClass = "w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all";
  const labelClass = "block text-xs font-medium text-[var(--text-secondary)] mb-1.5";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d]">
          <h2 className="text-lg font-semibold text-white">Nueva Conexión API</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Método</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                className={inputClass}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Auth Type</label>
              <select
                value={formData.authType}
                onChange={(e) => setFormData({ ...formData, authType: e.target.value })}
                className={inputClass}
              >
                <option value="NONE">NONE</option>
                <option value="BEARER">BEARER</option>
                <option value="BASIC">BASIC</option>
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>URL Base *</label>
            <input
              type="text"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://api.ejemplo.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Path Params</label>
            <input
              type="text"
              value={formData.pathParams}
              onChange={(e) => setFormData({ ...formData, pathParams: e.target.value })}
              placeholder="/ws/rest/service/v1/endpoint"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Descripción</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descripción de la conexión"
              className={inputClass}
            />
          </div>

          {formData.authType !== 'NONE' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Auth Header</label>
                <input
                  type="text"
                  value={formData.authHeader}
                  onChange={(e) => setFormData({ ...formData, authHeader: e.target.value })}
                  placeholder="Authorization"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Auth Value</label>
                <input
                  type="text"
                  value={formData.authValue}
                  onChange={(e) => setFormData({ ...formData, authValue: e.target.value })}
                  placeholder="Bearer token o Basic creds"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Body (JSON)</label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder='{"key": "value"}'
              rows={3}
              className={`${inputClass} font-mono text-xs`}
            />
          </div>

          <div className="border-t border-[#30363d] pt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasApiAuth}
                onChange={(e) => setFormData({ ...formData, hasApiAuth: e.target.checked })}
                className="w-4 h-4 rounded border-[#30363d] text-blue-500 focus:ring-blue-500/50"
              />
              <span className="text-sm text-gray-300">Configurar Auth API (para obtener token)</span>
            </label>

            {formData.hasApiAuth && (
              <div className="mt-4 p-4  rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Método Auth</label>
                    <select
                      value={formData.apiAuthMethod}
                      onChange={(e) => setFormData({ ...formData, apiAuthMethod: e.target.value })}
                      className={inputClass}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Auth Type</label>
                    <select
                      value={formData.apiAuthAuthType}
                      onChange={(e) => setFormData({ ...formData, apiAuthAuthType: e.target.value })}
                      className={inputClass}
                    >
                      <option value="NONE">NONE</option>
                      <option value="BEARER">BEARER</option>
                      <option value="BASIC">BASIC</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>URL Auth</label>
                  <input
                    type="text"
                    value={formData.apiAuthUrl}
                    onChange={(e) => setFormData({ ...formData, apiAuthUrl: e.target.value })}
                    placeholder="https://api.ejemplo.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Path Auth</label>
                  <input
                    type="text"
                    value={formData.apiAuthPathParams}
                    onChange={(e) => setFormData({ ...formData, apiAuthPathParams: e.target.value })}
                    placeholder="/ws/rest/service/v1/login"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Descripción Auth</label>
                  <input
                    type="text"
                    value={formData.apiAuthDescription}
                    onChange={(e) => setFormData({ ...formData, apiAuthDescription: e.target.value })}
                    placeholder="Login endpoint"
                    className={inputClass}
                  />
                </div>
                {formData.apiAuthAuthType !== 'NONE' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Auth Header</label>
                      <input
                        type="text"
                        value={formData.apiAuthAuthHeader}
                        onChange={(e) => setFormData({ ...formData, apiAuthAuthHeader: e.target.value })}
                        placeholder="Authorization"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Auth Value</label>
                      <input
                        type="text"
                        value={formData.apiAuthAuthValue}
                        onChange={(e) => setFormData({ ...formData, apiAuthAuthValue: e.target.value })}
                        placeholder="Basic base64creds"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#30363d]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#21262d] rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.url}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ConnectionsPage() {
  const { connections, loading, error, refetch, deleteConnection, createConnection, testConnection } = useApiConnections();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [testResult, setTestResult] = useState<{ loading: boolean; result: any } | null>(null);

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          conn.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMethod = filterMethod === 'all' || conn.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta conexión?')) {
      await deleteConnection(id);
    }
  };

  const handleTest = async (connection: ApiConnection) => {
    setTestResult({ loading: true, result: null });
    const result = await testConnection(connection);
    setTestResult({ loading: false, result });
  };

  const handleCreateConnection = async (payload: CreateConnectionPayload) => {
    setCreateError(null);
    setIsCreating(true);
    const result = await createConnection(payload);
    setIsCreating(false);
    if (result.success) {
      setIsModalOpen(false);
      refetch();
      addNotification('connection', 'API conectada', payload.description || payload.url);
    } else {
      setCreateError(result.error || 'Error al crear conexión');
    }
  };

  const methods = ['all', ...Array.from(new Set(connections.map(c => c.method)))];

  return (
    <div className="min-h-screen ">
      <div className="border-b border-[#21262d] top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                <Plug className="text-blue-400" size={28} />
                Conexiones API
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {connections.length} {connections.length === 1 ? 'conexión' : 'conexiones'} registradas
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar conexiones..."
                  className="bg-[#161b22] border border-[#30363d] rounded-lg pl-9 pr-4 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-blue-500/50 w-48 transition-all"
                />
              </div>

              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 cursor-pointer"
              >
                {methods.map(m => (
                  <option key={m} value={m}>
                    {m === 'all' ? 'Todos los métodos' : m}
                  </option>
                ))}
              </select>

              <button
                onClick={refetch}
                className="p-2 rounded-lg bg-[#161b22] border border-[#30363d] text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors"
                aria-label="Actualizar"
              >
                <RefreshCw size={16} />
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Nueva</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filteredConnections.length === 0 ? (
          <EmptyState onAddNew={() => setIsModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredConnections.map(conn => (
              <ConnectionCard
                key={conn.id}
                connection={conn}
                onDelete={handleDelete}
                onTest={handleTest}
              />
            ))}
          </div>
        )}
      </div>

      <CreateConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateConnection}
      />

      {testResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setTestResult(null)} />
          <div className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#30363d]">
              <div className="flex items-center gap-3">
                {testResult.loading ? (
                  <Loader2 className="text-blue-400 animate-spin" size={20} />
                ) : testResult.result?.success ? (
                  <CheckCircle className="text-emerald-400" size={20} />
                ) : (
                  <XCircle className="text-red-400" size={20} />
                )}
                <h2 className="text-lg font-semibold text-white">
                  {testResult.loading ? 'Probando conexión...' : testResult.result?.success ? 'Respuesta exitosa' : 'Error en la petición'}
                </h2>
              </div>
              <button
                onClick={() => setTestResult(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#21262d] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {testResult.loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="text-blue-400 animate-spin mb-4" size={32} />
                  <p className="text-gray-400">Ejecutando petición...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Status:</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        testResult.result.status >= 200 && testResult.result.status < 300
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : testResult.result.status >= 400
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {testResult.result.status || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Response Body</h3>
                    <pre className=" border border-[#30363d] rounded-lg p-4 text-xs text-gray-300 overflow-x-auto max-h-64 font-mono">
                      {testResult.result.data 
                        ? JSON.stringify(testResult.result.data, null, 2)
                        : testResult.result.error || 'Sin respuesta'}
                    </pre>
                  </div>

                  {testResult.result.response && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Error Details</h3>
                      <pre className=" border border-[#30363d] rounded-lg p-4 text-xs text-red-400 overflow-x-auto max-h-40 font-mono">
                        {JSON.stringify(testResult.result.response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-[#30363d]">
              <button
                onClick={() => setTestResult(null)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#21262d] rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-spin { animation: none; }
          .transition-all, .transition-colors { transition: none; }
        }
      `}</style>
    </div>
  );
}