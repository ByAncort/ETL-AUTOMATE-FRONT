import { Settings, Save, Bell, Lock, Globe } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PageHeader icon={<Settings size={16} />} title="Configuración Admin"
        description="Ajustes administrativos del sistema">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
          <Save size={14} /> {saved ? 'Guardado' : 'Guardar'}
        </button>
      </PageHeader>

      <div className="p-6 space-y-6">
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50">
              <Globe size={15} className="text-violet-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Configuración General</h3>
          </div>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Nombre del Sistema</label>
              <input type="text" defaultValue="ETL Automate"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">URL Base de la API</label>
              <input type="text" defaultValue="http://localhost:8080"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Timeout Global (segundos)</label>
              <input type="number" defaultValue="30"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all" />
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50">
              <Bell size={15} className="text-violet-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Notificaciones</h3>
          </div>
          <div className="space-y-3 max-w-lg">
            {[
              { label: 'Alertas de errores en integraciones', checked: true },
              { label: 'Notificaciones de nuevos usuarios', checked: true },
              { label: 'Resumen semanal de actividad', checked: false },
              { label: 'Alertas de rendimiento', checked: true },
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked}
                  className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30 cursor-pointer" />
                <span className="text-sm text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50">
              <Lock size={15} className="text-violet-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Seguridad</h3>
          </div>
          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Expiración de Token (horas)</label>
              <input type="number" defaultValue="24"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Máximo de Intentos de Login</label>
              <input type="number" defaultValue="5"
                className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all" />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked
                className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30 cursor-pointer" />
              <span className="text-sm text-slate-700">Requerir verificación de email</span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
