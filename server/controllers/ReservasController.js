const { Reserva, Utilizador, Obra, ExemplarFisico, Emprestimo } = require('../models');

module.exports = {
  async listarReservas(req, res) {
    try {
      const reservas = await Reserva.findAll({
        include: [
          { model: Utilizador, attributes: ['id', 'nome_completo', 'codigo_institucional'] },
          { model: Obra, attributes: ['id', 'titulo', 'autor'] }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(reservas);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar reservas' });
    }
  },

async confirmarReserva(req, res) {
    try {
      const { id } = req.params;
      
      const reserva = await Reserva.findByPk(id);
      if (!reserva) return res.status(404).json({ erro: 'Reserva não encontrada' });

      // Obtém o exemplar_id diretamente do registo da reserva
      const exemplar_id = reserva.exemplar_id;

      const exemplar = await ExemplarFisico.findByPk(exemplar_id);
      if (!exemplar || exemplar.estado !== 'disponivel') {
        return res.status(400).json({ erro: 'Exemplar não disponível.' });
      }

      reserva.estado = 'concluido';
      await reserva.save();

      const data_limite = new Date();
      data_limite.setDate(data_limite.getDate() + 14);

      const emprestimo = await Emprestimo.create({ 
        utilizador_id: reserva.utilizador_id, 
        exemplar_id, 
        data_limite_devolucao: data_limite, 
        estado: 'ativo' 
      });
      
      await ExemplarFisico.update({ estado: 'emprestado' }, { where: { id: exemplar_id } });

      res.json({ mensagem: 'Reserva confirmada!', emprestimo });
    } catch (error) {
      console.log("erro ao confirmar reserva: " , error);
      res.status(500).json({ erro: 'Erro ao confirmar reserva', detalhes: error.message });
    }
  },

  async eliminarReserva(req, res) {
    try {
      await Reserva.destroy({ where: { id: req.params.id } });
      res.json({ mensagem: 'Reserva eliminada com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao eliminar reserva' });
    }
  }
};