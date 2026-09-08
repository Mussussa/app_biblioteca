import React from "react";
import { Plus, Trash2 } from "lucide-react";

export default function FaculdadesView({ list, nome, setNome, sigla, setSigla, onSubmit, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <h3 className="text-sm font-bold text-slate-800">Faculdades & Cursos</h3>

      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Nome da faculdade (ex: Faculdade de Engenharia)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none flex-1"
        />
        <input
          type="text"
          placeholder="Sigla (ex: FENG)"
          value={sigla}
          onChange={(e) => setSigla(e.target.value)}
          className="bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none w-32 uppercase"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </form>

      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-400 font-semibold">
            <th className="pb-2">Sigla</th>
            <th className="pb-2">Nome da Faculdade</th>
            <th className="pb-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list.map((fac) => (
            <tr key={fac.id}>
              <td className="py-2.5 font-bold text-slate-700">{fac.sigla}</td>
              <td className="py-2.5 font-medium">{fac.nome}</td>
              <td className="py-2.5 text-right">
                <button onClick={() => onDelete("/admin/faculdades", fac.id)} className="text-red-500 hover:text-red-700">
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