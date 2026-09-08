const { Obra, ExemplarFisico, Emprestimo, Reserva, Utilizador } = require('../models');

module.exports = {
  async dashboard(req, res) {
    try {
      const totalLivros = await Obra.count();
      const livrosDisponiveis = await ExemplarFisico.count({ where: { estado: 'disponivel' } });
      const emprestimosAtivos = await Emprestimo.count({ where: { estado: 'ativo' } });
      const atrasados = await Emprestimo.count({ where: { estado: 'atrasado' } });
      const totalUtilizadores = await Utilizador.count();
      const reservasPendentes = await Reserva.count({ where: { estado: 'pendente' } });

      const emprestimosRecentes = await Emprestimo.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          { model: Utilizador, attributes: ['id', 'nome_completo', 'codigo_institucional'] },
          { 
            model: ExemplarFisico, 
            include: [{ model: Obra, attributes: ['id', 'titulo', 'autor'] }] 
          }
        ]
      });

      const reservasLista = await Reserva.findAll({
        where: { estado: 'pendente' },
        limit: 5,
        include: [
          { model: Utilizador, attributes: ['id', 'nome_completo', 'codigo_institucional'] },
          { model: Obra, attributes: ['id', 'titulo', 'autor'] }
        ]
      });

      res.json({
        metricas: { 
          totalLivros, 
          livrosDisponiveis, 
          emprestimosAtivos, 
          atrasados, 
          totalUtilizadores, 
          reservasPendentes 
        },
        emprestimosRecentes,
        reservasPendentes: reservasLista
      });
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao carregar dashboard', detalhes: error.message });
    }
  }
};