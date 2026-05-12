import { useState } from 'react';
import { Plug, Loader2, Save } from 'lucide-react';
import { CreateConnectionPayload } from '../../hooks/useApiConnections';
import Modal from '../ui/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateConnectionPayload) => Promise<void>;
}

export default function CreateConnectionModal({ isOpen, onClose, onSubmit }: Props) {
  const [formData, setFormData] = useState({
    method: 'GET', url: '', pathParams: '', description: '',
    authType: 'BEARER', authHeader: 'Authorization', body: '', authValue: '',
    hasApiAuth: false, apiAuthMethod: 'GET', apiAuthUrl: '', apiAuthPathParams: '',
    apiAuthDescription: '', apiAuthAuthType: 'BEARER', apiAuthAuthHeader: 'Authorization', apiAuthAuthValue: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const payload: CreateConnectionPayload = {
      method: formData.method, url: formData.url, pathParams: formData.pathParams,
      description: formData.description, authType: formData.authType,
      authHeader: formData.authHeader, body: formData.body || undefined,
      authValue: formData.authValue || undefined
    };
    if (formData.hasApiAuth) {
      payload.apiAuth = {
        method: formData.apiAuthMethod, url: formData.apiAuthUrl,
        pathParams: formData.apiAuthPathParams, description: formData.apiAuthDescription,
        authType: formData.apiAuthAuthType, authHeader: formData.apiAuthAuthHeader,
        authValue: formData.apiAuthAuthValue
      };
    }
    await onSubmit(payload);
    setIsSubmitting(false);
  };

  const update = (key: string, value: string | boolean) => setFormData(f => ({ ...f, [key]: value }));

  const inputClass = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all";
  const labelClass = "block text-xs font-medium text-slate-600 mb-1.5";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Conexión API"
      icon={<Plug size={15} />}
      size="xl"
      footer={
        <div className="flex gap-3 w-full">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" form="connection-form"
            disabled={isSubmitting || !formData.url}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      }
    >
      <form id="connection-form" onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Método</label>
            <select value={formData.method} onChange={(e) => update('method', e.target.value)} className={inputClass}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Auth Type</label>
            <select value={formData.authType} onChange={(e) => update('authType', e.target.value)} className={inputClass}>
              <option value="NONE">NONE</option>
              <option value="BEARER">BEARER</option>
              <option value="BASIC">BASIC</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>URL Base *</label>
          <input type="text" required value={formData.url} onChange={(e) => update('url', e.target.value)}
            placeholder="https://api.ejemplo.com" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Path Params</label>
          <input type="text" value={formData.pathParams} onChange={(e) => update('pathParams', e.target.value)}
            placeholder="/ws/rest/service/v1/endpoint" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Descripción</label>
          <input type="text" value={formData.description} onChange={(e) => update('description', e.target.value)}
            placeholder="Descripción de la conexión" className={inputClass} />
        </div>

        {formData.authType !== 'NONE' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Auth Header</label>
              <input type="text" value={formData.authHeader} onChange={(e) => update('authHeader', e.target.value)}
                placeholder="Authorization" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Auth Value</label>
              <input type="text" value={formData.authValue} onChange={(e) => update('authValue', e.target.value)}
                placeholder="Bearer token o Basic creds" className={inputClass} />
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>Body (JSON)</label>
          <textarea value={formData.body} onChange={(e) => update('body', e.target.value)}
            placeholder='{"key": "value"}' rows={3} className={`${inputClass} font-mono text-xs`} />
        </div>

        <div className="border-t border-slate-200 pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.hasApiAuth}
              onChange={(e) => update('hasApiAuth', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30" />
            <span className="text-sm text-slate-600">Configurar Auth API (para obtener token)</span>
          </label>

          {formData.hasApiAuth && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-4 border border-slate-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Método Auth</label>
                  <select value={formData.apiAuthMethod} onChange={(e) => update('apiAuthMethod', e.target.value)} className={inputClass}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Auth Type</label>
                  <select value={formData.apiAuthAuthType} onChange={(e) => update('apiAuthAuthType', e.target.value)} className={inputClass}>
                    <option value="NONE">NONE</option>
                    <option value="BEARER">BEARER</option>
                    <option value="BASIC">BASIC</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>URL Auth</label>
                <input type="text" value={formData.apiAuthUrl} onChange={(e) => update('apiAuthUrl', e.target.value)}
                  placeholder="https://api.ejemplo.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Path Auth</label>
                <input type="text" value={formData.apiAuthPathParams} onChange={(e) => update('apiAuthPathParams', e.target.value)}
                  placeholder="/ws/rest/service/v1/login" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Descripción Auth</label>
                <input type="text" value={formData.apiAuthDescription} onChange={(e) => update('apiAuthDescription', e.target.value)}
                  placeholder="Login endpoint" className={inputClass} />
              </div>
              {formData.apiAuthAuthType !== 'NONE' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Auth Header</label>
                    <input type="text" value={formData.apiAuthAuthHeader} onChange={(e) => update('apiAuthAuthHeader', e.target.value)}
                      placeholder="Authorization" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Auth Value</label>
                    <input type="text" value={formData.apiAuthAuthValue} onChange={(e) => update('apiAuthAuthValue', e.target.value)}
                      placeholder="Basic base64creds" className={inputClass} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
