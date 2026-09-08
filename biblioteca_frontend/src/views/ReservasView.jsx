import React from "react";
import { Trash2 } from "lucide-react";

export default function ReservasView({ list, onConfirmar, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800">Gestão de Reservas</h3>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-400 font-semibold">
            <th className="pb-2">ID</th>
            <th className="pb-2">Estado</th>
            <th className="pb-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list.map((res) => (
            <tr key={res.id}>
              <td className="py-2.5">{res.id}</td>
              <td className="py-2.5">{res.estado}</td>
              <td className="py-2.5 text-right space-x-2">
                <button onClick={() => onConfirmar(res.id)} className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg font-medium hover:bg-emerald-100">
                  Confirmar
                </button>
                <button onClick={() => onDelete("/bibliotecario/reservas", res.id)} className="text-red-500 hover:text-red-700" title="Eliminar Reserva">
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