const { Utilizador, Emprestimo, ExemplarFisico, Obra, Reserva, Curso, Faculdade } = require('../models');

module.exports = {
  async obterPerfil(req, res) {
    try {
      const utilizadorId = req.utilizador.id;
      const utilizador = await Utilizador.findByPk(utilizadorId, {
        attributes: { exclude: ['palavra_passe_hash'] },
        include: [
          { model: Curso, include: [Faculdade] }
        ]
      });

      if (!utilizador) {
        return res.status(404).json({ erro: 'Utilizador não encontrado.' });
      }

      return res.json(utilizador);
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      return res.status(500).json({ erro: 'Erro interno ao carregar o perfil.' });
    }
  },

  async listarMeusEmprestimos(req, res) {
    try {
      const utilizadorId = req.utilizador.id;
      const emprestimos = await Emprestimo.findAll({
        where: { utilizador_id: utilizadorId },
        include: [
          {
            model: ExemplarFisico,
            include: [{ model: Obra }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.json(emprestimos);
    } catch (error) {
      console.error('Erro ao listar empréstimos do utilizador:', error);
      return res.status(500).json({ erro: 'Erro ao carregar empréstimos.' });
    }
  },

  async listarMinhasReservas(req, res) {
    try {
      const utilizadorId = req.utilizador.id;
      const reservas = await Reserva.findAll({
        where: { utilizador_id: utilizadorId },
        include: [
          { model: Obra }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.json(reservas);
    } catch (error) {
      console.error('Erro ao listar reservas do utilizador:', error);
      return res.status(500).json({ erro: 'Erro ao carregar reservas.' });
    }
  },

  async atualizarPerfil(req, res) {
    try {
      const utilizadorId = req.utilizador.id;
      const { telefone, foto_url } = req.body;

      const utilizador = await Utilizador.findByPk(utilizadorId);
      if (!utilizador) {
        return res.status(404).json({ erro: 'Utilizador não encontrado.' });
      }

      if (telefone !== undefined) utilizador.telefone = telefone;
      if (foto_url !== undefined) utilizador.foto_url = foto_url;

      await utilizador.save();

      return res.json({
        mensagem: 'Perfil atualizado com sucesso!',
        utilizador: {
          id: utilizador.id,
          nome_completo: utilizador.nome_completo,
          email: utilizador.email,
          telefone: utilizador.telefone,
          perfil: utilizador.perfil,
          foto_url: utilizador.foto_url
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(500).json({ erro: 'Erro ao atualizar perfil.' });
    }
  }
};