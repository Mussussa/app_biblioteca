const { Reserva, Utilizador, Obra, ExemplarFisico, Emprestimo , sequelize} = require('../models');

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
  // Inicia uma transação para garantir integridade dos dados
  const t = await sequelize.transaction();

  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id, { transaction: t });
    if (!reserva) {
      await t.rollback();
      return res.status(404).json({ erro: 'Reserva não encontrada.' });
    }

    if (reserva.estado !== 'pendente' && reserva.estado !== 'pronto_levantamento') {
      await t.rollback();
      return res.status(400).json({ erro: 'Esta reserva já foi processada ou cancelada.' });
    }

    const exemplar = await ExemplarFisico.findByPk(reserva.exemplar_id, { transaction: t });
    
    // 💡 AJUSTE PRINCIPAL: O exemplar pode estar 'disponivel' OU 'reservado'
    if (!exemplar || (exemplar.estado !== 'disponivel' && exemplar.estado !== 'reservado')) {
      await t.rollback();
      return res.status(400).json({ 
        erro: `Não é possível confirmar. O exemplar encontra-se com o estado: ${exemplar?.estado || 'desconhecido'}.` 
      });
    }

    // 1. Atualizar o estado da Reserva para 'concluido'
    reserva.estado = 'concluido';
    await reserva.save({ transaction: t });

    // 2. Definir a data limite de devolução (14 dias)
    const data_limite = new Date();
    data_limite.setDate(data_limite.getDate() + 14);

    // 3. Criar o novo registo de Empréstimo
    const emprestimo = await Emprestimo.create({ 
      utilizador_id: reserva.utilizador_id, 
      exemplar_id: reserva.exemplar_id, 
      data_limite_devolucao: data_limite, 
      estado: 'ativo' 
    }, { transaction: t });

    // 4. Atualizar o estado do Exemplar Físico para 'emprestado'
    await exemplar.update({ estado: 'emprestado' }, { transaction: t });

    // Confirma todas as operações na base de dados
    await t.commit();

    return res.json({ 
      mensagem: 'Reserva confirmada e empréstimo gerado com sucesso!', 
      emprestimo 
    });

  } catch (error) {
    // Desfaz as alterações se ocorrer algum erro
    await t.rollback();
    console.error("Erro ao confirmar reserva:", error);
    return res.status(500).json({ 
      erro: 'Erro ao confirmar reserva.', 
      detalhes: error.message 
    });
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