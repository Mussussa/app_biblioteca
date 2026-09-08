import React from "react";
import { Trash2 } from "lucide-react";

export default function UtilizadoresView({ list, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800">Gestão de Utilizadores</h3>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-400 font-semibold">
            <th className="pb-2">Nome</th>
            <th className="pb-2">Email</th>
            <th className="pb-2">Perfil</th>
            <th className="pb-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list.map((user) => (
            <tr key={user.id}>
              <td className="py-2.5 font-medium">{user.nome_completo}</td>
              <td className="py-2.5 text-slate-600">{user.email}</td>
              <td className="py-2.5 capitalize">{user.perfil}</td>
              <td className="py-2.5 text-right">
                <button onClick={() => onDelete("/admin/utilizadores", user.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-4 h-4 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}