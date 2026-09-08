import React from 'react';
import { Search, Moon, Bell, LogOut } from 'lucide-react';

export default function Header() {
  const user = JSON.parse(localStorage.getItem('utilizador') || '{}');

  const handleLogout = () => {
    // 1. Limpa os dados de autenticação armazenados
    localStorage.removeItem('token');
    localStorage.removeItem('utilizador');

    // 2. Redireciona o utilizador para a página de login
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="relative w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Pesquisar livros, utilizadores, ISBN, etc..." 
          className="w-full bg-slate-100 border-none rounded-lg pl-9 pr-12 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono bg-slate-200 px-1.5 py-0.5 rounded">Ctrl + K</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
          <Moon className="w-4 h-4" />
        </button>
        <div className="relative">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
            <Bell className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
            {user.nome ? user.nome.charAt(0) : 'A'}
          </div>
          <div className="text-left leading-tight">
            <p className="text-xs font-bold text-slate-800">{user.nome || 'Administrador'}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user.perfil || 'Bibliotecário'}</p>
          </div>

          {/* Botão de Logout */}
          <button 
            onClick={handleLogout}
            title="Sair da conta"
            className="p-2 ml-2 text-red-500 hover:bg-red-50 rounded-lg transition duration-200"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}