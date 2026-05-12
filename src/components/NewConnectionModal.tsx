import { useState } from 'react';
import { X, Plug, Loader2, CheckCircle2, Braces, ChevronDown } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type LoaderState = 'idle' | 'loading' | 'success';

export default function NewConnectionModal({ onClose, onSuccess }: Props) {
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [loaderState, setLoaderState] = useState<LoaderState>('idle');

  const handleTest = () => {
    setLoaderState('loading');
    setTimeout(() => {
      setLoaderState('success');
      setTimeout(() => onSuccess(), 1200);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl animate-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
              <Plug size={15} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Conectar API Externa</h2>
              <p className="text-xs text-slate-500">Nueva Conexión Rápida</p>
            </div>
          </div>
          <button onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Nombre de la integración</label>
            <input type="text" placeholder="Ej: CRM Clientes v2"
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">URL del Endpoint</label>
            <input type="text" placeholder="https://api.example.com/v1/contacts"
              className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Método HTTP</label>
            <div className="relative">
              <select value={method} onChange={(e) => setMethod(e.target.value as 'GET' | 'POST')}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-pointer">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Token</label>
            <div className="relative">
              <Braces size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" placeholder="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-mono" />
            </div>
          </div>

          {loaderState === 'loading' && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200">
              <Loader2 size={15} className="text-blue-500 animate-spin flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-700">Inferiendo tipos de datos con Schema Discovery...</p>
                <p className="text-[11px] text-blue-500 mt-0.5">Detectando emails, fechas, entidades numéricas...</p>
              </div>
            </div>
          )}
          {loaderState === 'success' && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-emerald-700">Conexión exitosa — 7 campos detectados</p>
                <p className="text-[11px] text-emerald-500 mt-0.5">Abriendo Schema Matcher...</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-5">
          <button onClick={handleTest} disabled={loaderState !== 'idle'}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
            {loaderState === 'loading' ? <><Loader2 size={15} className="animate-spin" /> Analizando esquema...</> :
             loaderState === 'success' ? <><CheckCircle2 size={15} /> Conexión verificada</> :
             'Probar Conexión y Analizar Esquema'}
          </button>
        </div>
      </div>
    </div>
  );
}
