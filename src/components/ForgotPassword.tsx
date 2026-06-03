import { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import AuthLayout from './AuthLayout';

interface Props {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    try {
      await api.post('/api/users/forgot-password', { email: email.trim() });
      setSuccess(true);
    } catch {
      setError('Ocurrió un error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Recupera el acceso a tu cuenta">
      <div className="relative bg-[--bg-card] border border-[--border] rounded-2xl p-8 shadow-sm">
        <button onClick={onBack} className="absolute top-4 left-4 text-[--text-muted] hover:text-[--accent] p-1.5 rounded-lg hover:bg-[--bg-elevated] transition-colors">
          <ArrowLeft size={16} />
        </button>

        <div className="mt-2">
          {success ? (
            <div className="text-center">
              <div className="mx-auto w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-sm font-medium text-[--text-primary] mb-2">Revisa tu correo</h3>
              <p className="text-sm text-[--text-secondary] mb-7">
                Si existe una cuenta asociada a {email}, recibirás un enlace para restablecer tu contraseña.
              </p>
              <button onClick={onBack}
                className="w-full rounded-xl bg-[--accent] hover:bg-[--accent-hover] py-3 text-sm font-medium text-white transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]">
                Volver al Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <p className="text-sm text-[--text-secondary] mb-6">
                Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              <div>
                <label htmlFor="email" className="mb-2 block text-[11px] font-medium uppercase tracking-[0.08em] text-[--text-secondary]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[--text-muted]" />
                  <input id="email" type="email" placeholder="email@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full rounded-xl border border-[--border] bg-[--bg-card] py-3 pl-10 pr-4 text-sm text-[--text-primary] placeholder:text-[--text-muted] outline-none transition-all duration-200 focus:border-[--accent]/40 focus:shadow-[0_0_0_4px_var(--ring)]" />
                </div>
              </div>

              {error && <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-2.5 text-[11px] text-red-600 font-medium">{error}</div>}

              <button type="submit" disabled={loading || !email.trim()}
                className="group relative w-full flex items-center justify-center gap-2 rounded-xl bg-[--accent] hover:bg-[--accent-hover] py-3 text-sm font-medium text-white transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]">
                {loading ? 'Enviando…' : 'Enviar Instrucciones'}
                {!loading && <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
