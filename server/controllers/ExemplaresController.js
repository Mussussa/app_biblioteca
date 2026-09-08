const { ExemplarFisico, Obra } = require('../models');

module.exports = {
async listarExemplares(req, res) {
    try {
      const exemplares = await ExemplarFisico.findAll({ 
        include: [
          { 
            model: Obra, 
            attributes: ['id', 'titulo', 'autor'] 
          }
        ],
        order: [['createdAt', 'DESC']]
      });

    
        console.log("nao tem nunhum dado em listarExemplares: " ,exemplares )
      
      res.json(exemplares);
    } catch (error) {
      console.error("Erro ao listar exemplares:", error);
      res.status(500).json({ erro: 'Erro ao listar exemplares.', detalhes: error.message });
    }
  },

  async registarExemplar(req, res) {
    try {
      const { obra_id, localizacao_prateleira } = req.body;
      const codigo_exemplar = req.body.codigo_exemplar || req.body.codigo_barras;

      if (!obra_id || !codigo_exemplar) {
        return res.status(400).json({ error: "Preencha a obra e o código do exemplar/barras." });
      }

      const novoExemplar = await ExemplarFisico.create({
        obra_id,
        codigo_exemplar,
        localizacao_prateleira
      });

      return res.status(201).json({ mensagem: "Exemplar registado com sucesso!", novoExemplar });
    } catch (error) {
      console.error("Erro ao registar exemplar:", error);
      return res.status(500).json({ error: "Erro interno ao registar exemplar.", detalhes: error.message });
    }
  },

  async editarExemplar(req, res) {
    try {
      await ExemplarFisico.update(req.body, { where: { id: req.params.id } });
      res.json({ mensagem: 'Exemplar atualizado com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao editar exemplar' });
    }
  },

  async eliminarExemplar(req, res) {
    try {
      await ExemplarFisico.destroy({ where: { id: req.params.id } });
      res.json({ mensagem: 'Exemplar eliminado com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao eliminar exemplar' });
    }
  }
};