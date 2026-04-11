// components/Login.tsx
import { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Login decorativo - siempre permite entrar
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080d14] via-[#0f172a] to-[#1a1f3a] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-5 bg-cover bg-center" />
      
      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">DataUnify</h1>
          <p className="text-gray-400 text-sm">Plataforma de Integración de Datos</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-700 bg-[#1a1f3a] text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-gray-400">Recordarme</span>
              </label>
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
            >
              <span>Ingresar al Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              * Demo decorativo - No se validan credenciales
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">
            © 2024 DataUnify. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}