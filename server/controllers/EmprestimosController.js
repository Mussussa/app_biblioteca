const { Emprestimo, Utilizador, ExemplarFisico, Obra } = require('../models');

module.exports = {
  async listarEmprestimos(req, res) {
    try {
      const emprestimos = await Emprestimo.findAll({
        include: [
          { model: Utilizador, attributes: ['id', 'nome_completo', 'codigo_institucional'] },
          { model: ExemplarFisico, include: [{ model: Obra, attributes: ['titulo'] }] }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(emprestimos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar empréstimos' });
    }
  },

  async registarEmprestimo(req, res) {
    try {
      const { utilizador_id, exemplar_id, dias_limite = 14 } = req.body;
      const utilizador = await Utilizador.findByPk(utilizador_id);
      if (!utilizador) return res.status(404).json({ erro: 'Utilizador não encontrado.' });

      const exemplar = await ExemplarFisico.findByPk(exemplar_id);
      if (!exemplar) return res.status(404).json({ erro: 'Exemplar físico não encontrado.' });
      if (exemplar.estado !== 'disponivel') return res.status(400).json({ erro: `Exemplar não disponível.` });

      const data_limite = new Date();
      data_limite.setDate(data_limite.getDate() + dias_limite);

      const novoEmprestimo = await Emprestimo.create({ utilizador_id, exemplar_id, data_limite_devolucao: data_limite, estado: 'ativo' });
      await ExemplarFisico.update({ estado: 'emprestado' }, { where: { id: exemplar_id } });

      res.status(201).json({ mensagem: 'Empréstimo registado com sucesso!', novoEmprestimo });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao registar empréstimo', detalhes: error.message });
    }
  },

  async eliminarEmprestimo(req, res) {
    try {
      await Emprestimo.destroy({ where: { id: req.params.id } });
      res.json({ mensagem: 'Empréstimo eliminado com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao eliminar empréstimo' });
    }
  }
};