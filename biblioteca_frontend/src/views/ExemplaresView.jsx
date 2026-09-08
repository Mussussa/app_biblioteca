import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function ExemplaresView({ list, onOpenModal, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800">Exemplares Físicos (Prateleira)</h3>
        <button onClick={onOpenModal} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Registar Exemplar
        </button>
      </div>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-400 font-semibold">
            <th className="pb-2">Obra / Livro</th>
            <th className="pb-2">Código de Barras</th>
            <th className="pb-2">Localização</th>
            <th className="pb-2">Estado</th>
            <th className="pb-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list && list.length > 0 ? (
            list.map((ex) => (
              <tr key={ex.id} className="hover:bg-slate-50">
                <td className="py-2.5 font-medium text-slate-900">{ex.Obra?.titulo || "Obra desconhecida"}</td>
                <td className="py-2.5 text-slate-600">{ex.codigo_barras}</td>
                <td className="py-2.5 text-slate-600">{ex.localizacao_prateleira}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold capitalize ${ex.estado === "disponivel" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {ex.estado}
                  </span>
                </td>
                <td className="py-2.5 text-right">
                  <button onClick={() => onDelete("/bibliotecario/exemplares", ex.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-6 text-center text-slate-400">
                Nenhum exemplar físico registado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}