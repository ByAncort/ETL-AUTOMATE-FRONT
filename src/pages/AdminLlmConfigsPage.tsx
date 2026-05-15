import { useState } from 'react';
import { Brain, Plus, Pencil, Trash2, Star, X, Loader2 } from 'lucide-react';
import { useLlmConfigs } from '../hooks/useLlmConfigs';
import { LlmConfigRequest } from '../types';
import PageHeader from '../components/ui/PageHeader';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';

const defaultFormData: LlmConfigRequest = {
  name: '',
  provider: '',
  apiKey: '',
  baseUrl: '',
  modelName: '',
  isDefault: false,
};

export default function AdminLlmConfigsPage() {
  const { configs, loading, error, refetch, createConfig, updateConfig, deleteConfig, setDefault } = useLlmConfigs();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<LlmConfigRequest>(defaultFormData);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setShowModal(true);
  };

  const openEdit = (config: LlmConfigResponse) => {
    setEditingId(config.id);
    setFormData({
      name: config.name,
      provider: config.provider,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      modelName: config.modelName,
      isDefault: config.isDefault,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const result = editingId
      ? await updateConfig(editingId, formData)
      : await createConfig(formData);
    setSaving(false);
    if (result.success) {
      setShowModal(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta configuración LLM?')) return;
    await deleteConfig(id);
  };

  const handleSetDefault = async (id: number) => {
    await setDefault(id);
  };

  if (loading) return <LoadingState message="Cargando configuraciones LLM..." />;

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        icon={<Brain size={18} />}
        title="Configuración LLM"
        description="Administra las configuraciones de modelos de lenguaje"
      >
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition-colors"
        >
          <Plus size={16} /> Nueva Configuración
        </button>
      </PageHeader>

      {error && (
        <ErrorState message={error} onRetry={refetch} />
      )}

      {!error && configs.length === 0 && (
        <EmptyState
          icon={<Brain size={32} className="text-slate-400" />}
          title="Sin configuraciones LLM"
          description="Aún no hay modelos de lenguaje configurados. Crea una nueva configuración para empezar."
          actionLabel="Nueva Configuración"
          onAction={openCreate}
        />
      )}

      {!error && configs.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Nombre', 'Proveedor', 'Modelo', 'Default', 'Creado', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {configs.map(config => (
                  <tr key={config.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center">
                          <Brain size={14} className="text-violet-600" />
                        </div>
                        <div>
                          <span className="font-medium text-slate-900">{config.name}</span>
                          <span className="text-xs text-slate-400 ml-2">#{config.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{config.provider}</td>
                    <td className="px-4 py-3 text-slate-600">{config.modelName}</td>
                    <td className="px-4 py-3">
                      {config.isDefault ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <Star size={10} /> Default
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(config.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                        >
                          <Star size={10} /> Establecer
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(config.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(config)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-500 hover:bg-violet-50 transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(config.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Editar Configuración LLM' : 'Nueva Configuración LLM'}
        subtitle={editingId ? 'Modifica los datos del modelo de lenguaje' : 'Registra un nuevo modelo de lenguaje'}
        icon={<Brain size={16} />}
        size="lg"
        footer={
          <>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >Cancelar</button>
            <button
              onClick={handleSave}
              disabled={saving || !formData.name || !formData.provider || !formData.modelName}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {editingId ? 'Guardar' : 'Crear'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="GPT-4 Production"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Proveedor</label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                <option value="">Seleccionar...</option>
                <option value="openai">OpenAI</option>
                <option value="azure">Azure OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google AI</option>
                <option value="ollama">Ollama</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Modelo</label>
              <input
                type="text"
                value={formData.modelName}
                onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                placeholder="gpt-4"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Base URL</label>
            <input
              type="text"
              value={formData.baseUrl}
              onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              placeholder="https://api.openai.com/v1"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">API Key</label>
            <input
              type="password"
              value={formData.apiKey}
              onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
              placeholder="sk-proj-xxxxx"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30"
            />
            <span className="text-sm text-slate-700">Establecer como configuración por defecto</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}
