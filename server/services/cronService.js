const cron = require('node-cron');
const { Op } = require('sequelize');
const { Reserva, ExemplarFisico, sequelize } = require('../models');

function iniciarCronJobs() {
  // Executa a cada 5 minutos: '*/5 * * * *'
  cron.schedule('*/5 * * * *', async () => {
    console.log('--- [CRON] Verificando reservas expiradas... ---');
    const t = await sequelize.transaction();

    try {
      const agora = new Date();

      // 1. Busca reservas que já passaram da data prevista de levantamento
      // Exemplo: Tolera até 1 hora de atraso após a data agendada
      const limiteExpiracao = new Date(agora.getTime() - 60 * 60 * 1000); 

      const reservasExpiradas = await Reserva.findAll({
        where: {
          estado: ['pendente', 'pronto_levantamento'],
          data_prevista_levantamento: {
            [Op.lt]: limiteExpiracao // data_prevista_levantamento < limiteExpiracao
          }
        },
        transaction: t
      });

      if (reservasExpiradas.length === 0) {
        console.log('[CRON] Nenhuma reserva expirada encontrada.');
        await t.commit();
        return;
      }

      const exemplarIds = reservasExpiradas.map(r => r.exemplar_id);
      const reservaIds = reservasExpiradas.map(r => r.id);

      // 2. Atualiza os exemplares de volta para 'disponivel'
      await ExemplarFisico.update(
        { estado: 'disponivel' },
        { 
          where: { id: exemplarIds },
          transaction: t 
        }
      );

      // 3. Cancela as reservas expiradas
      await Reserva.update(
        { estado: 'cancelado' },
        { 
          where: { id: reservaIds },
          transaction: t 
        }
      );

      await t.commit();
      console.log(`[CRON] Sucesso: ${reservasExpiradas.length} reserva(s) expirada(s) cancelada(s) e exemplar(es) libertados.`);

    } catch (error) {
      await t.rollback();
      console.error('[CRON] Erro ao processar reservas expiradas:', error.message);
    }
  });
}

module.exports = iniciarCronJobs;