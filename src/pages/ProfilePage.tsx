import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, Mail, Lock, Eye, EyeOff, HelpCircle, 
  AlertTriangle, CheckCircle, Save, ArrowLeft 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const profileSchema = z.object({
  username: z.string(),
  email: z.string().trim().email('Debe ser un email válido').toLowerCase().max(100, 'Máximo 100 caracteres').regex(/^[^\s]+$/, 'El email no debe tener espacios'),
  firstName: z.string().trim().min(1, 'Nombre requerido').max(50, 'Máximo 50 caracteres').regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/, 'Solo letras sin tildes, ni espacios al final/inicio'),
  lastName: z.string().trim().min(1, 'Apellido requerido').max(50, 'Máximo 50 caracteres').regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/, 'Solo letras sin tildes, ni espacios al final/inicio'),
  password: z.string().optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password.length >= 6 && data.password.length <= 100 && !/\s/.test(data.password);
  }
  return true;
}, {
  message: "La contraseña debe tener entre 6 y 100 caracteres y sin espacios",
  path: ["password"],
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { userData, refetchUser, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCoachmark, setShowCoachmark] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    }
  });

  // Watch fields for dynamic notices
  const watchedEmail = watch('email');
  const hasEmailChanged = userData && watchedEmail && watchedEmail.toLowerCase().trim() !== userData.email.toLowerCase().trim();

  // Populate form when userData is loaded
  useEffect(() => {
    if (userData) {
      setValue('username', userData.username);
      setValue('email', userData.email);
      setValue('firstName', userData.firstName || userData.name?.split(' ')[0] || '');
      setValue('lastName', userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '');
    }
  }, [userData, setValue]);

  const onSubmit = async (data: ProfileForm) => {
    if (!userData?.id) return;
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const payload: any = {
        username: userData.username,
        email: data.email.trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
      };

      if (data.password && data.password.length > 0) {
        payload.password = data.password;
      }

      await api.put(`/api/users/${userData.id}`, payload);

      if (hasEmailChanged) {
        setSuccess('¡Perfil actualizado con éxito! Como cambiaste tu correo electrónico, tu cuenta ha sido desactivada temporalmente para revisión de seguridad. Serás redirigido para iniciar sesión de nuevo en unos segundos...');
        setTimeout(() => {
          logout();
        }, 5000);
      } else {
        setSuccess('¡Perfil actualizado con éxito! Los cambios se reflejarán inmediatamente en la aplicación.');
        await refetchUser();
        // Reset passwords
        setValue('password', '');
        setValue('confirmPassword', '');
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.response?.data?.message || 'Error al actualizar el perfil. Por favor verifica los datos o intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-xs font-semibold text-slate-700 mb-1.5";
  const inputClass = "w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white border-slate-200";
  const inputPlain = "w-full rounded-lg border py-2.5 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white border-slate-200";

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          aria-label="Volver"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Configuración de Perfil</h1>
          <p className="text-xs text-slate-500">Administra tus datos personales, credenciales y seguridad</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Overview card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <div className="mx-auto w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mb-4 shadow-inner">
              {userData?.name ? userData.name.substring(0, 2).toUpperCase() : userData?.username?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <h2 className="text-base font-bold text-slate-900 truncate">{userData?.name || userData?.username}</h2>
            <p className="text-xs text-slate-500 truncate mt-0.5">{userData?.email}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                Cuenta Activa
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Form card */}
        <div className="md:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">Detalles del Perfil</h2>

            {success && (
              <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50/80 px-4 py-3.5 text-xs text-emerald-700 flex items-start gap-3 backdrop-blur-sm shadow-sm">
                <CheckCircle size={16} className="shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50/80 px-4 py-3.5 text-xs text-red-700 flex items-start gap-3 backdrop-blur-sm shadow-sm">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Row 1: Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="profile-username" className="block text-xs font-semibold text-slate-700">Nombre de Usuario</label>
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setShowCoachmark(!showCoachmark)}
                        onBlur={() => setTimeout(() => setShowCoachmark(false), 200)}
                        className="text-slate-400 hover:text-blue-600 transition-colors p-0.5"
                        aria-label="Ayuda de usuario"
                      >
                        <HelpCircle size={14} />
                      </button>
                      
                      {showCoachmark && (
                        <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-900/95 backdrop-blur-md text-white rounded-lg p-3 text-xs shadow-xl border border-white/10 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <p className="font-medium leading-relaxed">
                            🔒 <strong>Identificador Único:</strong> Tu nombre de usuario está vinculado a tus pipelines de datos creados en el sistema y no se puede modificar por razones de seguridad de auditoría.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      id="profile-username" 
                      type="text" 
                      disabled 
                      {...register('username')}
                      className={`${inputClass} bg-slate-50 border-slate-200/60 text-slate-500 cursor-not-allowed`} 
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="profile-email" className={labelClass}>Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      id="profile-email" 
                      type="email" 
                      autoComplete="email"
                      {...register('email')}
                      className={`${inputClass} ${errors.email ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} 
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              {/* Email Warning Alert */}
              {hasEmailChanged && (
                <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-3.5 text-xs text-amber-800 flex items-start gap-3 backdrop-blur-sm shadow-sm animate-in fade-in duration-200">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <p className="font-semibold mb-0.5">⚠️ Requerirá Reactivación Administrativa</p>
                    <p className="leading-relaxed">Al modificar tu correo, tu cuenta pasará a estado inactivo de inmediato por seguridad. Tendrás que esperar a que un administrador active tu cuenta nuevamente y serás deslogueado al guardar.</p>
                  </div>
                </div>
              )}

              {/* Row 2: First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="profile-firstname" className={labelClass}>Nombre</label>
                  <input 
                    id="profile-firstname" 
                    type="text" 
                    autoComplete="given-name"
                    {...register('firstName')}
                    className={`${inputPlain} ${errors.firstName ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} 
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label htmlFor="profile-lastname" className={labelClass}>Apellido</label>
                  <input 
                    id="profile-lastname" 
                    type="text" 
                    autoComplete="family-name"
                    {...register('lastName')}
                    className={`${inputPlain} ${errors.lastName ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} 
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Divider for Security Section */}
              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-white pr-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Seguridad & Contraseña</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 -mt-2">Completa estos campos únicamente si deseas actualizar tu contraseña. De lo contrario, déjalos en blanco.</p>

              {/* Row 3: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="profile-password" className={labelClass}>Nueva Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      id="profile-password" 
                      type={showPassword ? 'text' : 'password'} 
                      autoComplete="new-password"
                      placeholder="••••••••" 
                      {...register('password')}
                      className={`${inputClass} ${errors.password ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="profile-confirm-password" className={labelClass}>Confirmar Nueva Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      id="profile-confirm-password" 
                      type={showPassword ? 'text' : 'password'} 
                      autoComplete="new-password"
                      placeholder="••••••••" 
                      {...register('confirmPassword')}
                      className={`${inputClass} ${errors.confirmPassword ? 'ring-2 ring-red-500/30 border-red-300' : ''}`} 
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all disabled:opacity-60 shadow-md hover:shadow-lg shadow-blue-600/10 focus:ring-2 focus:ring-blue-500/30"
                >
                  <Save size={16} />
                  {loading ? 'Guardando Cambios...' : 'Guardar Perfil'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
