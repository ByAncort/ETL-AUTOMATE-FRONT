import { useState } from 'react';
import { Lock, User, ArrowRight, Mail, UserPlus } from 'lucide-react';
import api from '../services/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const registerSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Debe ser un email válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido')
});

type RegisterForm = z.infer<typeof registerSchema>;

interface Props {
  onToggleForm: () => void;
}

export default function Register({ onToggleForm }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      await api.post('/api/users/register', data);
      setSuccess('Usuario creado exitosamente. Ya puedes iniciar sesión.');
      setTimeout(() => {
        onToggleForm();
      }, 2000);
    } catch (err: any) {
      console.error('Error registering', err);
      setError('No se pudo registrar. Quizás el usuario/email ya existe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-5 bg-cover bg-center dark:opacity-5 opacity-[0.03]" />
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-emerald-500/20 mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Registro</h1>
          <p className="text-gray-400 text-sm">Crea una nueva cuenta</p>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl p-8">
          
          {success ? (
            <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm text-center">
              {success}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    {...register('username')}
                    placeholder="nuevo_usuario"
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      {...register('firstName')}
                      placeholder="Juan"
                      className="w-full pl-10 pr-4 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Apellido</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      {...register('lastName')}
                      placeholder="Pérez"
                      className="w-full pl-10 pr-4 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="email@ejemplo.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    {...register('password')}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1f3a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
              </div>
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Registrando...' : 'Registrar Cuenta'}</span>
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}

          <div className="mt-6 text-center space-y-2">
            <p className="text-xs text-gray-500">
              ¿Ya tienes cuenta? <button onClick={onToggleForm} className="text-blue-400 hover:underline">Inicia Sesión</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
