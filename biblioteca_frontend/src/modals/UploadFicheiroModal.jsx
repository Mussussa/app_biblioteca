import React from "react";
import { X } from "lucide-react";

export default function UploadFicheiroModal({
  isOpen,
  onClose,
  obraSelecionada,
  onUpload,
  setFicheiroInput,
  uploading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-800">
            Carregar Ficheiro Digital (PDF/EPUB)
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Obra selecionada: <span className="font-semibold">{obraSelecionada?.titulo}</span>
        </p>
        <form onSubmit={onUpload} className="space-y-4">
          <input
            type="file"
            accept=".pdf,.epub"
            onChange={(e) => setFicheiroInput(e.target.files[0])}
            className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="flex justify-end gap-2">
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
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              {uploading ? "A enviar..." : "Guardar Ficheiro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}