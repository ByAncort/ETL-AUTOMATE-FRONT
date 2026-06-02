import { X, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface TestResultData {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: Record<string, any>;
}

interface Props {
  testResult: TestResultData;
  onClose: () => void;
}

export default function TestResultDialog({ testResult, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[80vh] overflow-hidden bg-white border border-[#5741d8]/[0.08] rounded-xl shadow-xl flex flex-col animate-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#5741d8]/[0.06]">
          <div className="flex items-center gap-3">
            {testResult.loading ? (
              <Loader2 className="text-[#5741d8] animate-spin" size={20} />
            ) : testResult.result?.success ? (
              <CheckCircle className="text-emerald-500" size={20} />
            ) : (
              <XCircle className="text-red-500" size={20} />
            )}
            <h2 className="text-sm font-semibold text-[#0a0a0a]">
              {testResult.loading ? 'Probando conexión...' :
               testResult.result?.success ? 'Respuesta exitosa' : 'Error en la petición'}
            </h2>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-[#0a0a0a]/35 hover:text-[#5741d8]/60 hover:bg-[#5741d8]/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {testResult.loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="text-[#5741d8] animate-spin mb-4" size={32} />
              <p className="text-[#0a0a0a]/50">Ejecutando petición...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testResult.result.status && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#0a0a0a]/50">Status:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    testResult.result.status >= 200 && testResult.result.status < 300
                      ? 'bg-emerald-100 text-emerald-700'
                      : testResult.result.status >= 400
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}>
                    {testResult.result.status}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-[#0a0a0a]/60 mb-2">Response Body</h3>
                <pre className="bg-[#5741d8]/5 border border-[#5741d8]/10 rounded-lg p-4 text-xs text-[#0a0a0a]/70 overflow-x-auto max-h-64 font-mono">
                  {testResult.result.data
                    ? JSON.stringify(testResult.result.data, null, 2)
                    : testResult.result.error || 'Sin respuesta'}
                </pre>
              </div>
              {testResult.result.response && (
                <div>
                  <h3 className="text-sm font-medium text-[#0a0a0a]/60 mb-2">Error Details</h3>
                  <pre className="bg-[#5741d8]/5 border border-[#5741d8]/10 rounded-lg p-4 text-xs text-red-600 overflow-x-auto max-h-40 font-mono">
                    {JSON.stringify(testResult.result.response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-[#5741d8]/[0.06]">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-[#0a0a0a]/60 hover:text-[#0a0a0a]/80 hover:bg-[#5741d8]/5 rounded-lg transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
