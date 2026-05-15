import { useState } from 'react';
import { Sparkles, CheckCheck, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { submitFeedback } from '../services/schemaMatchService';
import type { SchemaMatch } from '../types';

interface Props {
  match: SchemaMatch;
  userId: number;
  onReviewed: (updated: SchemaMatch) => void;
}

const statusBadge: Record<string, { label: string; class: string }> = {
  ACCEPTED: { label: 'Aceptado', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'Rechazado', class: 'bg-red-50 text-red-700 border-red-200' },
};

export default function MatchReviewCard({ match, userId, onReviewed }: Props) {
  const [actualTarget, setActualTarget] = useState(match.targetField);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitFeedback({
        matchId: match.id,
        userApproved: true,
        actualTarget: match.targetField,
        reviewedBy: userId,
      });
      if (result?.schemaMatch) onReviewed(result.schemaMatch);
    } catch (e: any) {
      if (e.response?.status === 409) {
        setError('Este match ya fue revisado por otro usuario');
      } else {
        setError('Error al enviar feedback');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectWithCorrection = async () => {
    if (!actualTarget.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitFeedback({
        matchId: match.id,
        userApproved: false,
        actualTarget: actualTarget.trim(),
        reviewedBy: userId,
      });
      if (result?.schemaMatch) onReviewed(result.schemaMatch);
    } catch (e: any) {
      if (e.response?.status === 409) {
        setError('Este match ya fue revisado por otro usuario');
      } else {
        setError('Error al enviar feedback');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isPending = match.status === 'PENDING';
  const confidencePct = Math.round(match.confidence * 100);
  const confidenceColor = confidencePct >= 95 ? '#059669' : confidencePct >= 85 ? '#2563eb' : confidencePct >= 75 ? '#d97706' : '#dc2626';
  const badge = statusBadge[match.status];

  return (
    <div className={cn(
      'grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-3 rounded-lg border transition-colors',
      isPending ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'
    )}>
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
        <div>
          <code className="text-xs text-slate-900 font-mono">{match.sourceField}</code>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 min-w-[80px]">
        {badge && !isPending ? (
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border', badge.class)}>
            {match.status === 'ACCEPTED' ? <CheckCheck size={9} /> : <XCircle size={9} />}
            {badge.label}
          </span>
        ) : (
          <>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-violet-100 to-blue-100 text-violet-700 border border-violet-200">
              <Sparkles size={9} />{confidencePct}%
            </div>
            <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${confidencePct}%`, background: confidenceColor }} />
            </div>
          </>
        )}
        <div className="relative flex items-center w-full">
          <div className="flex-1 h-px bg-gradient-to-r from-blue-300 via-violet-400 to-cyan-300" />
          <div className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {isPending ? (
          <input
            value={actualTarget}
            onChange={(e) => { setActualTarget(e.target.value); setError(null); }}
            disabled={submitting}
            className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:opacity-50"
          />
        ) : (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
            <div>
              <code className="text-xs text-slate-900 font-mono">{match.targetField}</code>
            </div>
          </div>
        )}

        {isPending && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleApprove}
              disabled={submitting}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 size={10} className="animate-spin" /> : <CheckCheck size={10} />}
              Aceptar
            </button>
            <button
              onClick={handleRejectWithCorrection}
              disabled={submitting || !actualTarget.trim()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 size={10} className="animate-spin" /> : <XCircle size={10} />}
              Rechazar
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-1 mt-1">
            <AlertCircle size={10} className="text-red-500" />
            <span className="text-[10px] text-red-600">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
