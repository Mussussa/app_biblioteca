const { Utilizador, Emprestimo, ExemplarFisico, Obra, Reserva, Curso, Faculdade } = require('../models');

module.exports = {
async obterPerfil(req, res) {
    try {
      const { id } = req.utilizador || {};
      
      if (!id) {
        return res.status(401).json({ erro: 'Não autorizado. Utilizador não identificado.' });
      }

      // 1. Fazemos as 3 consultas à base de dados EM SIMULTÂNEO para ser super rápido
      const [utilizador, reservas, emprestimos] = await Promise.all([
        
        // Busca os dados do utilizador
        Utilizador.findByPk(id, {
          attributes: { exclude: ['palavra_passe_hash', 'createdAt', 'updatedAt'] },
          include: [
            { 
              model: Curso, 
              attributes: ['id', 'nome'],
              include: [{ model: Faculdade, attributes: ['id', 'nome', 'sigla'] }] 
            }
          ]
        }),

        // Busca o histórico de Reservas
        Reserva.findAll({
          where: { utilizador_id: id },
          order: [['data_reserva', 'DESC']],
          include: [
            {
              model: ExemplarFisico,
              include: [{ model: Obra, attributes: ['titulo'] }]
            }
          ]
        }),

        // Busca o histórico de Empréstimos (confirma se o nome do teu model é 'Emprestimo')
        Emprestimo.findAll({
          where: { utilizador_id: id },
          order: [['data_emprestimo', 'DESC']], // ou a data de criação apropriada
          include: [
            {
              model: ExemplarFisico,
              include: [{ model: Obra, attributes: ['titulo'] }]
            }
          ]
        })
      ]);

      if (!utilizador) {
        return res.status(404).json({ erro: 'Utilizador não encontrado.' });
      }

      // 2. Formatar os históricos para puxar o "titulo" da obra para a raiz, como o frontend gosta
      const formatarHistorico = (lista) => lista.map(item => {
        const json = item.toJSON();
        if (json.ExemplarFisico && json.ExemplarFisico.Obra) {
          json.Obra = json.ExemplarFisico.Obra;
        }
        return json;
      });

      // 3. Montar a resposta final juntando tudo
      const respostaFinal = {
        ...utilizador.toJSON(),
        historico_reservas: formatarHistorico(reservas),
        historico_emprestimos: formatarHistorico(emprestimos)
      };

      return res.status(200).json(respostaFinal);

    } catch (error) {
      console.error(`[PerfilController] Erro ao obter perfil (UserID: ${req.utilizador?.id}):`, error);
      return res.status(500).json({ erro: 'Erro interno ao carregar o perfil completo.' });
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