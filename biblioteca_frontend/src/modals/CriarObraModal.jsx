import React from 'react';
import { X, BookPlus, ImagePlus, FileText } from 'lucide-react';

export default function CriarObraModal({ isOpen, onClose, data, setData, setCapaFile, setFicheiroFile, onSubmit }) {
  if (!isOpen) return null;

  const isDigitalOuHibrido = data.tipo_recurso === 'digital' || data.tipo_recurso === 'hibrido';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <BookPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Registar Nova Obra</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Campo de Upload de Imagem (Capa) */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Capa da Obra (Imagem)</label>
            <div className="flex items-center gap-3 w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus-within:border-blue-500 bg-white">
              <ImagePlus className="w-4 h-4 text-slate-400" />
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setCapaFile(e.target.files[0])}
                className="w-full focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Título da Obra</label>
            <input 
              type="text" 
              required
              value={data.titulo || ''} 
              onChange={(e) => setData({ ...data, titulo: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Autor</label>
              <input 
                type="text" 
                required
                value={data.autor || ''} 
                onChange={(e) => setData({ ...data, autor: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ISBN</label>
              <input 
                type="text" 
                required
                value={data.isbn || ''} 
                onChange={(e) => setData({ ...data, isbn: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Ano</label>
              <input 
                type="number" 
                value={data.ano_publicacao || ''} 
                onChange={(e) => setData({ ...data, ano_publicacao: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo</label>
              <select 
                value={data.tipo_recurso || 'fisico'} 
                onChange={(e) => setData({ ...data, tipo_recurso: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="fisico">Físico</option>
                <option value="digital">Digital</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>

          {/* Campo Condicional de Upload de Ficheiro Digital (PDF/EPUB) */}
          {isDigitalOuHibrido && (
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
              <label className="block text-xs font-semibold text-blue-700 mb-1">Ficheiro Digital (PDF ou EPUB)</label>
              <div className="flex items-center gap-3 w-full px-3 py-2 text-xs border border-blue-200 rounded-lg bg-white">
                <FileText className="w-4 h-4 text-blue-500" />
                <input 
                  type="file" 
                  accept=".pdf,.epub"
                  onChange={(e) => setFicheiroFile(e.target.files[0])}
                  className="w-full focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Categoria e Editora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Categoria (Nome)</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Informática"
                value={data.categoria_nome || ''} 
                onChange={(e) => setData({ ...data, categoria_nome: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Editora (Nome)</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Pearson"
                value={data.editora_nome || ''} 
                onChange={(e) => setData({ ...data, editora_nome: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Sinopse</label>
            <textarea 
              rows="3"
              value={data.sinopse || ''} 
              onChange={(e) => setData({ ...data, sinopse: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Registar Obra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}