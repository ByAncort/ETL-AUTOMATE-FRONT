// components/AdminPanel.tsx
import React from 'react';
import { users, systemLogs, integrations as allIntegrations } from '../data/mockData';

export default function AdminPanel() {
  return (
    <div className="space-y-6">
      {/* Header Admin */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          <p className="text-gray-400 text-sm mt-1">Gestión completa del sistema</p>
        </div>
        <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-lg">
          <span className="text-purple-400 text-xs font-mono">MODO ADMIN</span>
        </div>
      </div>

      {/* Stats Admin */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#0f1724] border border-gray-800 rounded-lg p-4">
          <p className="text-gray-500 text-xs">Usuarios Activos</p>
          <p className="text-2xl font-bold text-white">24</p>
        </div>
        <div className="bg-[#0f1724] border border-gray-800 rounded-lg p-4">
          <p className="text-gray-500 text-xs">Integraciones</p>
          <p className="text-2xl font-bold text-white">{allIntegrations.length}</p>
        </div>
        <div className="bg-[#0f1724] border border-gray-800 rounded-lg p-4">
          <p className="text-gray-500 text-xs">Registros Sincronizados</p>
          <p className="text-2xl font-bold text-white">1,284</p>
        </div>
        <div className="bg-[#0f1724] border border-gray-800 rounded-lg p-4">
          <p className="text-gray-500 text-xs">Errores (24h)</p>
          <p className="text-2xl font-bold text-red-400">3</p>
        </div>
      </div>

      {/* Gestión de Usuarios */}
      <div className="bg-[#0f1724] border border-gray-800 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-gray-300">👥 Gestión de Usuarios</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b border-gray-800">
              <tr>
                <th className="text-left px-4 py-3">Usuario</th>
                <th className="text-left px-4 py-3">Rol</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-800/50">
                <td className="px-4 py-3 text-gray-300">admin@empresa.com</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Administrador</span></td>
                <td className="px-4 py-3"><span className="text-green-400">● Activo</span></td>
                <td className="px-4 py-3">
                  <button className="text-red-400 hover:text-red-300 text-xs">Eliminar</button>
                </td>
              </tr>
              <tr className="border-b border-gray-800/50">
                <td className="px-4 py-3 text-gray-300">usuario1@empresa.com</td>
                <td className="px-4 py-3"><span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Usuario</span></td>
                <td className="px-4 py-3"><span className="text-green-400">● Activo</span></td>
                <td className="px-4 py-3">
                  <button className="text-red-400 hover:text-red-300 text-xs">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs del Sistema */}
      <div className="bg-[#0f1724] border border-gray-800 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-gray-300">📋 Logs del Sistema</h3>
        </div>
        <div className="space-y-1 p-2 font-mono text-xs">
          <div className="text-gray-500 py-1">[2024-01-15 10:23:45] INFO - Sincronización completada</div>
          <div className="text-gray-500 py-1">[2024-01-15 09:15:22] WARN - Timeout en conexión API</div>
          <div className="text-gray-500 py-1">[2024-01-15 08:45:10] INFO - Nueva integración añadida</div>
        </div>
      </div>
    </div>
  );
}