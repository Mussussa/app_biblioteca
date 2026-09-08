import React from 'react';
import { X, BookmarkPlus } from 'lucide-react';

export default function CriarExemplarModal({ isOpen, onClose, data, setData, obrasList = [], onSubmit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Registar Exemplar Físico</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Selecionar Obra / Livro</label>
            <select 
              required
              value={data.obra_id || ''} 
              onChange={(e) => setData({ ...data, obra_id: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">-- Escolha uma obra --</option>
              {obrasList && obrasList.map((obra) => (
                <option key={obra.id} value={obra.id}>
                  {obra.titulo} {obra.autor ? `(${obra.autor})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Código de Barras</label>
            <input 
              type="text" 
              required
              placeholder="Ex: CB-987654"
              value={data.codigo_barras || ''} 
              onChange={(e) => setData({ ...data, codigo_barras: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Localização na Prateleira</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Corredor A, Prateleira 3"
              value={data.localizacao_prateleira || ''} 
              onChange={(e) => setData({ ...data, localizacao_prateleira: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Registar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}