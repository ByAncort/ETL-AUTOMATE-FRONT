import { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, Zap, CheckCircle2 } from 'lucide-react';
import GlobeCanvas from './ui/GlobeCanvas';

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
      // TODO: Implement actual SMTP email logic in backend (e.g. Google SMTP)
      // await api.post('/api/users/forgot-password', { email });
      
      // Simulating a successful reset request for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch {
      setError('Ocurrió un error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white/90 border-slate-200/80";

  return (
    <div className="relative min-h-screen flex">
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-600/25">
              <Zap size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Restablecer Contraseña</h1>
            <p className="text-sm text-slate-600 mt-1">Te enviaremos las instrucciones</p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl p-8 shadow-xl shadow-slate-200/50 relative">
            <button onClick={onBack} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <ArrowLeft size={18} />
            </button>
            
            <div className="mt-4">
              {success ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">Revisa tu correo</h3>
                  <p className="text-sm text-slate-500">
                    Si existe una cuenta asociada a {email}, recibirás un enlace para restablecer tu contraseña.
                  </p>
                  <button onClick={onBack} className="mt-4 w-full py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Volver al Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-sm text-slate-600 mb-6">
                    Ingresa el correo electrónico asociado a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
                  </p>
                  
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-700">Email</label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input id="email" type="email" placeholder="email@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className={inputClass} />
                    </div>
                  </div>

                  {error && <div className="rounded-lg border border-red-200 bg-red-50/90 px-3 py-2.5 text-xs text-red-600 backdrop-blur-sm">{error}</div>}

                  <button type="submit" disabled={loading || !email.trim()}
                    className="group relative w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60 shadow-lg shadow-blue-600/25">
                    {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                    {!loading && <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        <GlobeCanvas className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
