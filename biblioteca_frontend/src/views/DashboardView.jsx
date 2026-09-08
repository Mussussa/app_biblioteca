import React from "react";
import { BookOpen, CheckCircle, Repeat, AlertTriangle, Users, Bookmark, ArrowRight } from "lucide-react";

function MetricCard({ icon, label, value, color, border }) {
  return (
    <div className={`bg-white p-4 rounded-xl border ${border} shadow-sm flex items-center gap-4`}>
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <h4 className="text-lg font-bold text-slate-800">{value}</h4>
      </div>
    </div>
  );
}

export default function DashboardView({ loading, metricas, emprestimosRecentes, reservasPendentes, onConfirmarReserva, setActiveTab }) {
  if (loading) {
    return <div className="py-20 text-center text-slate-500 font-medium text-xs">A carregar métricas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-6 gap-4">
        <MetricCard icon={<BookOpen className="text-purple-600" />} label="Total de Livros" value={metricas?.totalLivros || 0} color="bg-purple-50" border="border-purple-200" />
        <MetricCard icon={<CheckCircle className="text-emerald-600" />} label="Livros Disponíveis" value={metricas?.livrosDisponiveis || 0} color="bg-emerald-50" border="border-emerald-200" />
        <MetricCard icon={<Repeat className="text-blue-600" />} label="Empréstimos Ativos" value={metricas?.emprestimosAtivos || 0} color="bg-blue-50" border="border-blue-200" />
        <MetricCard icon={<AlertTriangle className="text-orange-600" />} label="Atrasados" value={metricas?.atrasados || 0} color="bg-orange-50" border="border-orange-200" />
        <MetricCard icon={<Users className="text-cyan-600" />} label="Utilizadores" value={metricas?.totalUtilizadores || 0} color="bg-cyan-50" border="border-cyan-200" />
        <MetricCard icon={<Bookmark className="text-rose-600" />} label="Reservas Pendentes" value={metricas?.reservasPendentes || 0} color="bg-rose-50" border="border-rose-200" />
      </div>

      {/* Secção de Reservas Pendentes (Alinhada com o JSON do dashboard) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-slate-800">Reservas Pendentes Recentes</h3>
          <button onClick={() => setActiveTab("reservas")} className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            Ver todas <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-semibold">
              <th className="pb-2">Código</th>
              <th className="pb-2">Estudante</th>
              <th className="pb-2">Obra</th>
              <th className="pb-2">Data da Reserva</th>
              <th className="pb-2">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reservasPendentes?.length > 0 ? (
              reservasPendentes.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50">
                  <td className="py-2.5 font-bold text-slate-700">{res.codigo_reserva}</td>
                  <td className="py-2.5 font-medium">{res.Utilizador?.nome_completo}</td>
                  <td className="py-2.5 text-slate-600">{res.Obra?.titulo}</td>
                  <td className="py-2.5 text-slate-500">{new Date(res.data_reserva).toLocaleDateString()}</td>
                  <td className="py-2.5">
                    <button 
                      onClick={() => onConfirmarReserva(res.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-[10px] font-bold"
                    >
                      Confirmar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-slate-400">Nenhuma reserva pendente de momento.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tabela de Empréstimos Recentes */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-bold text-slate-800">Empréstimos recentes</h3>
          <button onClick={() => setActiveTab("emprestimos")} className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            Ver todos <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-semibold">
              <th className="pb-2">Utilizador</th>
              <th className="pb-2">Livro</th>
              <th className="pb-2">Data Limite</th>
              <th className="pb-2">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {emprestimosRecentes?.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50">
                <td className="py-2.5 font-medium">{emp.Utilizador?.nome_completo}</td>
                <td className="py-2.5 text-slate-600">{emp.ExemplarFisico?.Obra?.titulo}</td>
                <td className="py-2.5 text-slate-500">{new Date(emp.data_limite_devolucao).toLocaleDateString()}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold capitalize ${emp.estado === "ativo" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {emp.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}