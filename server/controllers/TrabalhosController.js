const { RepositorioTrabalho , Faculdade } = require('../models');
const supabase = require('../config/supabase');

module.exports = {
async listarTrabalhos(req, res) {
    try {
      const trabalhos = await RepositorioTrabalho.findAll({
        include: [
          { 
            model: Faculdade, 
            attributes: ['id', 'nome', 'sigla'] 
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(trabalhos);
    } catch (error) {
      console.error("Erro ao listar trabalhos:", error);
      res.status(500).json({ erro: 'Erro ao listar trabalhos.', detalhes: error.message });
    }
  },

  async registarTrabalho(req, res) {
    try {
      const titulo = req.body.titulo;
      const autor_estudante = req.body.autor_estudante || req.body.autor;
      const ano_defesa = req.body.ano_defesa || req.body.ano;
      const faculdade_id = req.body.faculdade_id;
      const file = req.file;

      if (!file) return res.status(400).json({ error: 'Nenhum ficheiro em anexo (PDF).' });
      if (!titulo || !autor_estudante || !ano_defesa || !faculdade_id) {
        return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
      }

      const fileName = `trabalho_${Date.now()}_${Math.random().toString(36).substring(2)}.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('documente')
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage.from('documente').getPublicUrl(fileName);
      const pdf_url = publicUrlData?.publicUrl || null;

      const novoTrabalho = await RepositorioTrabalho.create({
        titulo, autor_estudante, ano_defesa, faculdade_id, pdf_url
      });

      return res.status(201).json({ mensagem: 'Trabalho registado com sucesso!', novoTrabalho });
    } catch (error) {
      console.error("Erro ao registar trabalho:", error);
      return res.status(500).json({ erro: 'Erro ao registar trabalho.', detalhes: error.message });
    }
  },

  async editarTrabalho(req, res) {
    try {
      await RepositorioTrabalho.update(req.body, { where: { id: req.params.id } });
      res.json({ mensagem: 'Trabalho atualizado!' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao editar trabalho.' });
    }
  },

  async eliminarTrabalho(req, res) {
    try {
      const trabalho = await RepositorioTrabalho.findByPk(req.params.id);
      if (trabalho && trabalho.pdf_url) {
        const nomeFicheiro = trabalho.pdf_url.split('/').pop();
        await supabase.storage.from('documente').remove([nomeFicheiro]);
      }
      await RepositorioTrabalho.destroy({ where: { id: req.params.id } });
      res.json({ mensagem: 'Trabalho eliminado com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao eliminar trabalho.' });
    }
  }
};