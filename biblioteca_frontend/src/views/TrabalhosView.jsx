import React from "react";
import { Plus, Trash2, FileText, ExternalLink, Building2 } from "lucide-react";

export default function TrabalhosView({ list, onOpenModal, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800">Trabalhos Académicos e Monografias</h3>
        <button onClick={onOpenModal} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Submeter Trabalho
        </button>
      </div>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-400 font-semibold">
            <th className="pb-2">Título / Tipo</th>
            <th className="pb-2">Autor (Estudante)</th>
            <th className="pb-2">Faculdade</th>
            <th className="pb-2">Ano Defesa</th>
            <th className="pb-2">Documento PDF</th>
            <th className="pb-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list && list.length > 0 ? (
            list.map((trab) => (
              <tr key={trab.id} className="hover:bg-slate-50">
                <td className="py-2.5">
                  <div className="font-bold text-slate-800">{trab.titulo}</div>
                  <div className="text-[10px] text-blue-600 uppercase font-semibold tracking-wider">
                    {trab.tipo_trabalho || "Trabalho Académico"}
                  </div>
                </td>
                <td className="py-2.5 font-medium text-slate-700">{trab.autor_estudante}</td>
                <td className="py-2.5 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{trab.Faculdade?.sigla || trab.Faculdade?.nome || "Geral"}</span>
                  </div>
                </td>
                <td className="py-2.5 text-slate-500">{trab.ano_defesa}</td>
                <td className="py-2.5">
                  {trab.pdf_url ? (
                    <a 
                      href={trab.pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-red-500" />
                      <span>Ver PDF</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Sem PDF</span>
                  )}
                </td>
                <td className="py-2.5 text-right space-x-2">
                  <button onClick={() => onDelete("/bibliotecario/trabalhos", trab.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-6 text-center text-slate-400">
                Nenhum trabalho académico registado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}