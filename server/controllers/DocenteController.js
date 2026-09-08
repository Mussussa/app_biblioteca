const { Obra, ExemplarFisico, Emprestimo, Reserva, Utilizador, Categoria, Editora } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // 1. Consultar Catálogo de Obras
  async listarObras(req, res) {
    try {
      const obras = await Obra.findAll({
        include: [{ model: Categoria }, { model: Editora }],
        order: [['titulo', 'ASC']]
      });
      res.json(obras);
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao listar obras', detalhes: error.message });
    }
  },

  // 2. Listar Empréstimos do Docente
  async meusEmprestimos(req, res) {
    try {
      const { utilizador_id } = req.params;
      const emprestimos = await Emprestimo.findAll({
        include: [
          { 
            model: ExemplarFisico, 
            include: [{ model: Obra, attributes: ['titulo', 'autor', 'isbn'] }] 
          }
        ],
        where: { utilizador_id },
        order: [['createdAt', 'DESC']]
      });
      res.json(emprestimos);
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao buscar empréstimos', detalhes: error.message });
    }
  },

  // 3. Listar Reservas do Docente
  async minhasReservas(req, res) {
    try {
      const { utilizador_id } = req.params;
      const reservas = await Reserva.findAll({
        where: { utilizador_id },
        include: [{ model: Obra, attributes: ['id', 'titulo', 'autor', 'isbn'] }],
        order: [['createdAt', 'DESC']]
      });
      res.json(reservas);
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao buscar reservas', detalhes: error.message });
    }
  },

  // 4. Criar Nova Reserva de Obra
  async criarReserva(req, res) {
    try {
      const { utilizador_id, obra_id } = req.body;

      const obra = await Obra.findByPk(obra_id);
      if (!obra) return res.status(404).json({ erro: 'Obra não encontrada.' });

      const reservaExistente = await Reserva.findOne({
        where: { utilizador_id, obra_id, estado: 'pendente' }
      });
      if (reservaExistente) {
        return res.status(400).json({ erro: 'Já possui uma reserva pendente para esta obra.' });
      }

      const novaReserva = await Reserva.create({
        utilizador_id,
        obra_id,
        estado: 'pendente'
      });

      res.status(201).json({ mensagem: 'Reserva efetuada com sucesso!', novaReserva });
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao criar reserva', detalhes: error.message });
    }
  },

  // 5. Solicitar Renovação de Empréstimo
  async renovarEmprestimo(req, res) {
    try {
      const { id } = req.params;
      const emprestimo = await Emprestimo.findByPk(id);

      if (!emprestimo) return res.status(404).json({ erro: 'Empréstimo não encontrado.' });
      if (emprestimo.estado !== 'ativo') {
        return res.status(400).json({ erro: 'Apenas empréstimos ativos podem ser renovados.' });
      }
      if (emprestimo.renovacoes_restantes <= 0) {
        return res.status(400).json({ erro: 'Limite de renovações esgotado.' });
      }

      const novaDataLimite = new Date(emprestimo.data_limite_devolucao);
      novaDataLimite.setDate(novaDataLimite.getDate() + 14);

      emprestimo.data_limite_devolucao = novaDataLimite;
      emprestimo.renovacoes_restantes -= 1;
      await emprestimo.save();

      res.json({ mensagem: 'Empréstimo renovado com sucesso!', emprestimo });
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao renovar empréstimo', detalhes: error.message });
    }
  }
};