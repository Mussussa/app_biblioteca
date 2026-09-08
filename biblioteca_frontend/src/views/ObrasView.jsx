import React from "react";
import { FileText, Upload, Trash2, Plus, Image as ImageIcon } from "lucide-react";

export default function ObrasView({ list, onVerFicheiro, onOpenUpload, onOpenModal, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800">Gestão de Obras / Acervo Geral e Digital</h3>
        <button 
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Registar Nova Obra
        </button>
      </div>

      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-slate-400 font-semibold">
            <th className="pb-2">ID</th>
            <th className="pb-2">Capa</th>
            <th className="pb-2">Título / Sinopse</th>
            <th className="pb-2">Autor</th>
            <th className="pb-2">ISBN</th>
            <th className="pb-2">Ano</th>
            <th className="pb-2">Tipo</th>
            <th className="pb-2">Ficheiro</th>
            <th className="pb-2 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list.map((obra) => (
            <tr key={obra.id} className="hover:bg-slate-50">
              <td className="py-2.5 font-medium">{obra.id}</td>
              
              {/* Coluna da Capa */}
              <td className="py-2.5">
                {obra.capa_url ? (
                  <img 
                    src={obra.capa_url} 
                    alt={obra.titulo} 
                    className="w-9 h-12 object-cover rounded shadow-sm border border-slate-200" 
                  />
                ) : (
                  <div className="w-9 h-12 bg-slate-100 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400" title="Sem capa">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
              </td>

              <td className="py-2.5 max-w-xs">
                <p className="font-bold text-slate-700">{obra.titulo}</p>
                <p className="text-[11px] text-slate-400 truncate">{obra.sinopse}</p>
              </td>
              <td className="py-2.5 text-slate-600">{obra.autor}</td>
              <td className="py-2.5 text-slate-500">{obra.isbn}</td>
              <td className="py-2.5 text-slate-500">{obra.ano_publicacao}</td>
              <td className="py-2.5">
                <span className="px-2 py-0.5 text-[10px] rounded-full font-bold uppercase bg-slate-100 text-slate-600">
                  {obra.tipo_recurso}
                </span>
              </td>
              <td className="py-2.5">
                <div className="flex items-center gap-2">
                  <button onClick={() => onVerFicheiro(obra.id)} title="Ver / Transferir Ficheiro Digital" className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button onClick={() => onOpenUpload(obra)} title="Carregar Ficheiro Digital (PDF/EPUB)" className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                    <Upload className="w-4 h-4" />
                  </button>
                </div>
              </td>
              <td className="py-2.5 text-right">
                <button onClick={() => onDelete("/bibliotecario/obras", obra.id)} className="text-red-500 hover:text-red-700">
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