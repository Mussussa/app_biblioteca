const { Obra, FicheiroDigital, Categoria, Editora, ExemplarFisico, RepositorioTrabalho , Reserva} = require('../models');
const { Op } = require('sequelize');

const PublicoController = {
  // ==========================================
  // 1. LISTAR OBRAS PÚBLICAS (Com filtros e paginação)
  // ==========================================
async listarObras(req, res) {
    try {
      const { q, categoria_id, editora_id, tipo_recurso, limit = 20, page = 1 } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereCondition = {};

      if (q) {
        whereCondition[Op.or] = [
          { titulo: { [Op.iLike]: `%${q}%` } },
          { autor: { [Op.iLike]: `%${q}%` } },
          { isbn: { [Op.iLike]: `%${q}%` } }
        ];
      }

      // Mapeia e sanitiza os filtros vindos do frontend para corresponder ao ENUM do Banco
      if (tipo_recurso) {
        const filtroUpper = tipo_recurso.toUpperCase();
        
        if (filtroUpper === 'FISICO' || filtroUpper === 'FÍSICO') {
          whereCondition.tipo_recurso = 'fisico'; // ou 'Físico' conforme preferir
        } else if (filtroUpper === 'PDF' || filtroUpper === 'DIGITAL') {
          whereCondition.tipo_recurso = 'digital';
        } else if (filtroUpper === 'HIBRIDO' || filtroUpper === 'HÍBRIDO') {
          whereCondition.tipo_recurso = 'hibrido';
        }
        // Se for TCC ou outro que não seja ENUM direto, você pode tratar aqui se necessário
      }

      if (categoria_id) {
        whereCondition.categoria_id = categoria_id;
      }

      if (editora_id) {
        whereCondition.editora_id = editora_id;
      }

      const { count, rows: obras } = await Obra.findAndCountAll({
        where: whereCondition,
        include: [
          {
            model: FicheiroDigital,
            as: 'ficheiro',
            attributes: ['id', 'ficheiro_url', 'formato', 'tamanho_bytes']
          },
          {
            model: Categoria,
            attributes: ['id', 'nome']
          },
          {
            model: Editora,
            attributes: ['id', 'nome']
          },
          {
            model: ExemplarFisico,
            attributes: ['id', 'codigo_exemplar', 'estado', 'localizacao_prateleira']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        total: count,
        pagina_atual: parseInt(page),
        total_paginas: Math.ceil(count / parseInt(limit)),
        obras
      });
    } catch (error) {
      console.error('Erro ao listar obras públicas:', error);
      return res.status(500).json({
        erro: 'Erro interno ao listar obras.',
        detalhes: error.message
      });
    }
  },

  // ==========================================
  // 2. OBTER DETALHES DE UMA OBRA ESPECÍFICA
  // ==========================================
async obterObraPorId(req, res) {
    try {
      const { id } = req.params;

      const obra = await Obra.findByPk(id, {
        include: [
          {
            model: FicheiroDigital,
            as: 'ficheiro',
            attributes: ['id', 'ficheiro_url', 'formato', 'tamanho_bytes']
          },
          {
            model: Categoria,
            // as: 'categoria', // Descomenta isto se tiveres configurado o alias no modelo para evitar o nome "Categorium"
            attributes: ['id', 'nome']
          },
          {
            model: Editora,
            // as: 'editora',
            attributes: ['id', 'nome']
          },
          {
            model: ExemplarFisico,
            attributes: ['id', 'codigo_exemplar', 'estado', 'localizacao_prateleira']
          }
        ]
      });

      if (!obra) {
        return res.status(404).json({ erro: 'Obra não encontrada.' });
      }

      return res.status(200).json(obra);
    } catch (error) {
      console.error('Erro ao buscar detalhes da obra:', error);
      return res.status(500).json({
        erro: 'Erro interno ao buscar a obra.',
        detalhes: error.message
      });
    }
  },

  // ==========================================
  // 3. OBTER / BAIXAR FICHEIRO DIGITAL DA OBRA
  // ==========================================
  async baixarFicheiroDigital(req, res) {
    try {
      const { obra_id } = req.params;

      const ficheiro = await FicheiroDigital.findOne({
        where: { obra_id }
      });

      if (!ficheiro || !ficheiro.ficheiro_url) {
        return res.status(404).json({
          erro: 'Ficheiro digital (PDF/EPUB) não disponível para esta obra.'
        });
      }

      return res.status(200).json({
        mensagem: 'Ficheiro localizado com sucesso.',
        download_url: ficheiro.ficheiro_url,
        formato: ficheiro.formato,
        tamanho_bytes: ficheiro.tamanho_bytes
      });
    } catch (error) {
      console.error('Erro ao buscar ficheiro digital:', error);
      return res.status(500).json({
        erro: 'Erro interno ao buscar ficheiro.',
        detalhes: error.message
      });
    }
  },

  // ==========================================
  // 4. LISTAR TRABALHOS ACADÉMICOS (TCCs / Monografias) PUBLICAMENTE
  // ==========================================
  async listarTrabalhosPublicos(req, res) {
    try {
      const { q, faculdade_id, limit = 20, page = 1 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const whereCondition = {};

      if (q) {
        whereCondition[Op.or] = [
          { titulo: { [Op.iLike]: `%${q}%` } },
          { autor_estudante: { [Op.iLike]: `%${q}%` } }
        ];
      }

      if (faculdade_id) {
        whereCondition.faculdade_id = faculdade_id;
      }

      const { count, rows: trabalhos } = await RepositorioTrabalho.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json({
        total: count,
        pagina_atual: parseInt(page),
        total_paginas: Math.ceil(count / parseInt(limit)),
        trabalhos
      });
    } catch (error) {
      console.error('Erro ao listar trabalhos públicos:', error);
      return res.status(500).json({
        erro: 'Erro interno ao listar trabalhos acadêmicos.',
        detalhes: error.message
      });
    }
  },

  // ==========================================
  // 5. LISTAR CATEGORIAS E EDITORAS (Para filtros no Frontend)
  // ==========================================
  async listarFiltrosAuxiliares(req, res) {
    try {
      const categorias = await Categoria.findAll({ attributes: ['id', 'nome'], order: [['nome', 'ASC']] });
      const editoras = await Editora.findAll({ attributes: ['id', 'nome'], order: [['nome', 'ASC']] });

      return res.status(200).json({
        categorias,
        editoras
      });
    } catch (error) {
      console.error('Erro ao buscar filtros auxiliares:', error);
      return res.status(500).json({
        erro: 'Erro interno ao buscar categorias e editoras.',
        detalhes: error.message
      });
    }
  },
async criarReserva(req, res) {
  try {
    console.log('--- [DEBUG] Início de criarReserva ---');
    const { obra_id, exemplar_id, data_prevista_levantamento } = req.body;

    if (!obra_id || !exemplar_id || !data_prevista_levantamento) {
      return res.status(400).json({ 
        erro: 'Os campos obra_id, exemplar_id e data_prevista_levantamento são obrigatórios.' 
      });
    }

    // 💡 OTIMIZAÇÃO: Busca o ID em qualquer propriedade injetada pelo middleware de autenticação
    const idUsuario = req.utilizador?.id || req.user?.id || req.usuario?.id || req.user?.sub;

    if (!idUsuario) {
      return res.status(401).json({ 
        erro: 'Utilizador não autenticado ou token inválido.' 
      });
    }

    // --- Validação de Data e Hora ---
    const dataAgendada = new Date(data_prevista_levantamento);
    const agora = new Date();

    if (dataAgendada <= agora) {
      return res.status(400).json({ erro: 'A data e hora de levantamento devem ser no futuro.' });
    }

    const diaSemana = dataAgendada.getDay(); // 0 = Dom, 6 = Sáb
    if (diaSemana === 0 || diaSemana === 6) {
      return res.status(400).json({ erro: 'O levantamento só pode ser feito de Segunda a Sexta-feira.' });
    }

    const horaAgendada = dataAgendada.getHours();
    if (horaAgendada < 8 || horaAgendada >= 15) {
      return res.status(400).json({ erro: 'O horário de levantamento deve ser entre as 08:00 e as 15:00.' });
    }

    // --- Verificar se o Exemplar existe ---
    const exemplar = await ExemplarFisico.findOne({
      where: { id: exemplar_id, obra_id: obra_id }
    });

    if (!exemplar) {
      return res.status(404).json({ erro: 'Exemplar não encontrado para esta obra.' });
    }

    // --- Verificar conflito de datas para este exemplar ---
    const inicioDoDiaAgendado = new Date(dataAgendada);
    inicioDoDiaAgendado.setHours(0, 0, 0, 0);

    const fimDoDiaAgendado = new Date(dataAgendada);
    fimDoDiaAgendado.setHours(23, 59, 59, 999);

    const reservaConflituante = await Reserva.findOne({
      where: {
        exemplar_id: exemplar_id,
        estado: ['pendente', 'pronto_levantamento'],
        data_prevista_levantamento: {
          [Op.between]: [inicioDoDiaAgendado, fimDoDiaAgendado]
        }
      }
    });

    if (reservaConflituante) {
      return res.status(400).json({ 
        erro: 'Este exemplar já possui um agendamento de reserva para a data solicitada.' 
      });
    }

    // --- Criar o registo da Reserva ---
    const novaReserva = await Reserva.create({
      utilizador_id: idUsuario, // 💡 ID garantido e não nulo
      exemplar_id: exemplar_id,
      data_reserva: new Date(),
      data_prevista_levantamento: dataAgendada,
      estado: 'pendente'
    });

    return res.status(201).json({
      mensagem: 'Reserva agendada com sucesso! O livro estará reservado na data solicitada.',
      reserva: novaReserva
    });

  } catch (error) {
    console.error('--- Erro crítico ao criar reserva ---', error);
    return res.status(500).json({ 
      erro: 'Erro interno ao processar a solicitação de reserva.',
      detalhes: error.message 
    });
  }
}
};

module.exports = PublicoController;