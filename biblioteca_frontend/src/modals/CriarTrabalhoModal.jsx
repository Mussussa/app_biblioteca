import React from "react";
import { X, Loader2 } from "lucide-react";

export default function CriarTrabalhoModal({
  isOpen,
  onClose,
  data,
  setData,
  setFicheiro,
  faculdadesList = [],
  onSubmit,
  uploading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800">Submeter Trabalho Académico</h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600">Título</label>
            <input
              type="text"
              placeholder="Título do trabalho"
              value={data.titulo || ""}
              onChange={(e) => setData({ ...data, titulo: e.target.value })}
              className="w-full mt-1 bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Autor (Estudante)</label>
            <input
              type="text"
              placeholder="Nome do autor"
              value={data.autor_estudante || ""}
              onChange={(e) => setData({ ...data, autor_estudante: e.target.value })}
              className="w-full mt-1 bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Ano de Defesa</label>
              <input
                type="number"
                placeholder="2026"
                value={data.ano_defesa || ""}
                onChange={(e) => setData({ ...data, ano_defesa: e.target.value })}
                className="w-full mt-1 bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Tipo de Trabalho</label>
              <select
                value={data.tipo_trabalho || "tcc"}
                onChange={(e) => setData({ ...data, tipo_trabalho: e.target.value })}
                className="w-full mt-1 bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500"
              >
                <option value="tcc">TCC / Licenciatura</option>
                <option value="dissertacao">Dissertação</option>
                <option value="tese">Tese</option>
                <option value="monografia">Monografia</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Faculdade</label>
            <select
              value={data.faculdade_id || ""}
              onChange={(e) => setData({ ...data, faculdade_id: e.target.value })}
              className="w-full mt-1 bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-blue-500 bg-white"
              required
            >
              <option value="">-- Selecione a faculdade --</option>
              {faculdadesList && faculdadesList.map((fac) => (
                <option key={fac.id} value={fac.id}>
                  {fac.nome} ({fac.sigla})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Ficheiro PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFicheiro(e.target.files[0])}
              className="w-full mt-1 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-1.5"
            >
              {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {uploading ? "A enviar..." : "Submeter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}