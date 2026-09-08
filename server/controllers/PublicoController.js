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
      console.log('[DEBUG] req.body recebido:', JSON.stringify(req.body));
      console.log('[DEBUG] req.user recebido do middleware:', req.user);
      console.log('[DEBUG] Header Authorization:', req.headers.authorization);

      const { obra_id, exemplar_id, utilizador_id } = req.body;

      // 1. Validações básicas de entrada
      if (!obra_id || !exemplar_id) {
        console.log('[DEBUG] Falha: obra_id ou exemplar_id em falta.');
        return res.status(400).json({ 
          erro: 'Os campos obra_id e exemplar_id são obrigatórios.' 
        });
      }

      // Se não houver utilizador_id vindo do body ou de middleware de autenticação (req.user.id)
const idUsuario = req.utilizador ? req.utilizador.id : null;
      console.log('[DEBUG] idUsuario resolvido:', idUsuario);

      if (!idUsuario) {
        console.log('[DEBUG] Falha: Utilizador não identificado (idUsuario é null/undefined).');
        return res.status(400).json({
          erro: 'Utilizador não identificado para efetuar a reserva.'
        });
      }

      // 2. Verificar se o exemplar existe, se pertence à obra e se está disponível
      const exemplar = await ExemplarFisico.findOne({
        where: {
          id: exemplar_id,
          obra_id: obra_id
        }
      });

      if (!exemplar) {
        console.log('[DEBUG] Falha: Exemplar não encontrado para esta obra.');
        return res.status(404).json({ 
          erro: 'Exemplar não encontrado para esta obra.' 
        });
      }

      console.log('[DEBUG] Estado atual do exemplar:', exemplar.estado);
      if (exemplar.estado !== 'disponivel') {
        console.log('[DEBUG] Falha: Exemplar indisponível.');
        return res.status(400).json({ 
          erro: `Este exemplar não está disponível para reserva (Estado atual: ${exemplar.estado}).` 
        });
      }

      // 3. Verificar se o utilizador já tem uma reserva ativa para este mesmo exemplar
      const reservaExistente = await Reserva.findOne({
        where: {
          utilizador_id: idUsuario,
          exemplar_id: exemplar_id,
          estado: 'pendente'
        }
      });

      if (reservaExistente) {
        console.log('[DEBUG] Falha: Utilizador já possui reserva pendente para este exemplar.');
        return res.status(400).json({ 
          erro: 'Você já possui uma reserva pendente para este exemplar.' 
        });
      }

      // 4. Criar o registo da Reserva com estado 'pendente'
      const novaReserva = await Reserva.create({
        utilizador_id: idUsuario,
        obra_id: obra_id,
        exemplar_id: exemplar_id,
        data_reserva: new Date(),
        estado: 'pendente'
      });
      console.log('[DEBUG] Reserva criada com sucesso, ID:', novaReserva.id);

      // 5. Atualizar o estado do exemplar físico para "reservado"
      await exemplar.update({ estado: 'reservado' });
      console.log('[DEBUG] Estado do exemplar atualizado para "reservado".');

      return res.status(201).json({
        mensagem: 'Reserva solicitada com sucesso!',
        reserva: novaReserva
      });

    } catch (error) {
      console.error('--- [DEBUG] Erro crítico ao criar reserva ---', error);
      return res.status(500).json({ 
        erro: 'Erro interno ao processar a solicitação de reserva.',
        detalhes: error.message 
      });
    }
  },
};

module.exports = PublicoController;