import React from "react";
import { Trash2 } from "lucide-react";

export default function EmprestimosView({ list, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800">Gestão de Empréstimos</h3>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-400 font-semibold">
            <th className="pb-2">ID</th>
            <th className="pb-2">Utilizador</th>
            <th className="pb-2">Estado</th>
            <th className="pb-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list.map((emp) => (
            <tr key={emp.id}>
              <td className="py-2.5">{emp.id}</td>
              <td className="py-2.5">{emp.Utilizador?.nome_completo || "N/D"}</td>
              <td className="py-2.5">{emp.estado}</td>
              <td className="py-2.5 text-right">
                <button onClick={() => onDelete("/bibliotecario/emprestimos", emp.id)} className="text-red-500 hover:text-red-700" title="Eliminar Empréstimo">
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