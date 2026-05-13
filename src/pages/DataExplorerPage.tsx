import { Database, Search, Table, Filter, Download } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

export default function DataExplorerPage() {
  return (
    <div>
      <PageHeader icon={<Database size={16} />} title="Explorador de Datos"
        description="Explora y visualiza tus fuentes de datos">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
          <Download size={14} /> Exportar
        </button>
      </PageHeader>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar tablas, columnas..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500" />
          </div>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer">
            <option>Todas las fuentes</option>
            <option>HubSpot CRM</option>
            <option>ERP MockAPI</option>
            <option>Salesforce</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {['Usuarios', 'Pedidos', 'Productos', 'Facturas', 'Contactos', 'Transacciones'].map((name, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
                  <Table size={15} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{name}</h3>
                  <p className="text-xs text-slate-400">{Math.floor(Math.random() * 20) + 5} columnas</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {['id (int)', 'nombre (varchar)', 'email (varchar)', 'created_at (timestamp)'].map((col, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs text-slate-500">
                    <Filter size={10} className="text-slate-300" />
                    <code className="font-mono text-slate-600">{col}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
          <Database size={32} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Vista Previa de Datos</h3>
          <p className="text-xs text-slate-400">Selecciona una tabla para ver una vista previa de sus registros</p>
        </div>
      </div>
    </div>
  );
}
