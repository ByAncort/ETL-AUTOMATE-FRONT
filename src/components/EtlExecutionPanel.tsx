import { useState } from 'react';
import { Play, RotateCcw, Loader2, AlertCircle, CheckCircle, Database, GitCompare, Upload } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEtlExecution, type EtlPhase } from '../hooks/useEtlExecution';

interface Props {
  integrationId: number;
  hasApprovedMatches: boolean;
  onClose: () => void;
}

const phaseLabels: Record<EtlPhase, string> = {
  idle: 'Listo para ejecutar',
  extracting: 'Extrayendo datos del origen...',
  transforming: 'Transformando campos...',
  loading: 'Cargando datos en destino...',
  done: 'ETL completado exitosamente',
  error: 'Error en ETL',
};

const phaseIcon: Record<EtlPhase, React.ReactNode> = {
  idle: <Database size={14} />,
  extracting: <Loader2 size={14} className="animate-spin" />,
  transforming: <GitCompare size={14} className="animate-spin" />,
  loading: <Upload size={14} className="animate-spin" />,
  done: <CheckCircle size={14} />,
  error: <AlertCircle size={14} />,
};

export default function EtlExecutionPanel({ integrationId, hasApprovedMatches, onClose }: Props) {
  const { phase, result, error, progress, execute, reset } = useEtlExecution();
  const [showConfirm, setShowConfirm] = useState(false);

  const isRunning = phase === 'extracting' || phase === 'transforming' || phase === 'loading';
  const canRun = hasApprovedMatches && !isRunning && phase !== 'done';

  const handleRunClick = () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }
    setShowConfirm(false);
    execute(integrationId);
  };

  return (
    <div className="flex flex-col gap-3">
      {!hasApprovedMatches && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
          <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-700">
            Debes aprobar al menos un SchemaMatch antes de ejecutar el ETL
          </p>
        </div>
      )}

      {phase !== 'idle' && (
        <div className="flex flex-col gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: phase === 'error' ? '#dc2626' : 'linear-gradient(90deg, #8b5cf6, #3b82f6)',
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'flex items-center gap-1.5 text-xs font-medium',
              phase === 'error' ? 'text-red-600' : 'text-slate-600'
            )}>
              {phaseIcon[phase]}
              {phaseLabels[phase]}
            </span>
            <span className="ml-auto text-[10px] text-slate-400 font-mono">{progress}%</span>
          </div>
        </div>
      )}

      {result && (
        <div className={cn(
          'rounded-xl border p-4',
          result.errors.length === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
        )}>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900">{result.totalRecords}</div>
              <div className="text-[10px] text-slate-500 font-medium">Extraídos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-slate-900">{result.transformedRecords}</div>
              <div className="text-[10px] text-slate-500 font-medium">Transformados</div>
            </div>
            <div className="text-center">
              <div className={cn(
                'text-lg font-bold',
                result.loadedRecords === result.totalRecords ? 'text-emerald-600' : 'text-amber-600'
              )}>
                {result.loadedRecords}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">Cargados</div>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-amber-200">
              <p className="text-[10px] font-semibold text-amber-700 mb-1.5">
                Errores ({result.errors.length})
              </p>
              <ul className="space-y-0.5">
                {result.errors.map((err, i) => (
                  <li key={i} className="text-[10px] text-amber-600 flex items-start gap-1">
                    <span>•</span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {error && !result && phase === 'error' && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleRunClick}
          disabled={!canRun && !showConfirm}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors',
            isRunning
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : showConfirm
                ? 'bg-amber-500 hover:bg-amber-400 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white',
            !canRun && !showConfirm && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isRunning ? (
            <><Loader2 size={14} className="animate-spin" /> Ejecutando...</>
          ) : showConfirm ? (
            <><AlertCircle size={14} /> ¿Confirmar ejecución?</>
          ) : (
            <><Play size={14} fill="currentColor" /> Ejecutar ETL Ahora</>
          )}
        </button>
        {phase === 'done' && (
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={14} /> Reiniciar
          </button>
        )}
        {!isRunning && phase !== 'done' && (
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
}
