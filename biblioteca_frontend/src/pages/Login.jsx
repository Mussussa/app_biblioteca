import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { BookOpen, Lock, User } from 'lucide-react';

export default function Login() {
  const [codigo, setCodigo] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Ajusta a rota '/auth/login' conforme o endpoint real do teu backend de autenticação
      const response = await api.post('/auth/login', {
        codigo_institucional: codigo,
        palavra_passe: palavraPasse
      });

      // Guarda o token e dados do utilizador
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('utilizador', JSON.stringify(response.data.utilizador));

      // Redireciona para o painel administrativo
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Credenciais inválidas ou erro no servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-xl mb-3">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">I.J.BibliotecaApp</h1>
          <p className="text-xs text-slate-500 mt-1">Painel de Acesso Restrito - UniPúnguè</p>
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-medium text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Código Institucional</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: EST2026001"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Palavra-passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={palavraPasse}
                onChange={(e) => setPalavraPasse(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {carregando ? 'A autenticar...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}