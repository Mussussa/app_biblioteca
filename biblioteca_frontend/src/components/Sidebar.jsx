import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Repeat, Calendar, 
  Users, GraduationCap, ChevronDown, FileText, Layers 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [acervoOpen, setAcervoOpen] = useState(true);

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-800 text-sm">
      <div className="p-4 overflow-y-auto">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg text-white font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white leading-none">I.J.bibliotecaApp</h1>
            <span className="text-[11px] text-slate-400">Painel Administrativo</span>
          </div>
        </div>

        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">Menu Principal</p>
        <nav className="space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>

          <div>
            <button 
              onClick={() => setAcervoOpen(!acervoOpen)} 
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium hover:bg-slate-800 text-slate-400"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4" /> Acervo
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${acervoOpen ? 'rotate-180' : ''}`} />
            </button>
            {acervoOpen && (
              <div className="ml-7 pl-3 border-l border-slate-800 space-y-1 my-1">
                <button 
                  onClick={() => setActiveTab('obras')} 
                  className={`w-full flex items-center gap-2 text-left py-1.5 text-xs transition ${activeTab === 'obras' ? 'text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  <BookOpen className="w-3.5 h-3.5" /> Livros & Obras
                </button>
                <button 
                  onClick={() => setActiveTab('exemplares')} 
                  className={`w-full flex items-center gap-2 text-left py-1.5 text-xs transition ${activeTab === 'exemplares' ? 'text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  <Layers className="w-3.5 h-3.5 text-purple-400" /> Exemplares Físicos
                </button>
                <button 
                  onClick={() => setActiveTab('trabalhos')} 
                  className={`w-full flex items-center gap-2 text-left py-1.5 text-xs transition ${activeTab === 'trabalhos' ? 'text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" /> Trabalhos Académicos
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setActiveTab('emprestimos')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition ${activeTab === 'emprestimos' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Repeat className="w-4 h-4" /> Empréstimos
          </button>
          <button onClick={() => setActiveTab('reservas')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition ${activeTab === 'reservas' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Calendar className="w-4 h-4" /> Reservas
          </button>
          <button onClick={() => setActiveTab('utilizadores')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition ${activeTab === 'utilizadores' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <Users className="w-4 h-4" /> Utilizadores
          </button>
          <button onClick={() => setActiveTab('faculdades')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition ${activeTab === 'faculdades' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}>
            <GraduationCap className="w-4 h-4" /> Faculdades & Cursos
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 flex items-center gap-2">
        <div className="p-1.5 bg-slate-800 rounded">
          <BookOpen className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">I.J.bibliotecaApp</p>
          <p className="text-[10px] text-slate-500">UniPúnguè</p>
        </div>
      </div>
    </aside>
  );
}