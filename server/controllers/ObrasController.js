const { Obra, FicheiroDigital , Editora , Categoria } = require('../models');
const supabase = require('../config/supabase');

module.exports = {
  async listarObras(req, res) {
    try {
      const obras = await Obra.findAll();
      res.status(200).json(obras);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar obras', detalhes: error.message });
    }
  },

async registarObra(req, res) {
  try {
    const { titulo, autor, isbn, ano_publicacao, sinopse, tipo_recurso, categoria_nome, editora_nome } = req.body;
    
    // Com upload.fields, os ficheiros ficam agrupados em req.files
    const capaFile = req.files?.capa?.[0];
    const ficheiroFile = req.files?.ficheiro?.[0];

    if (!titulo || !autor || !isbn || !categoria_nome || !editora_nome) {
      return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios, incluindo categoria e editora.' });
    }

    const obraExistente = await Obra.findOne({ where: { isbn } });
    if (obraExistente) return res.status(400).json({ erro: 'Já existe uma obra registada com este ISBN.' });

    // 1. Procurar ou criar a Categoria
    const [categoria] = await Categoria.findOrCreate({
      where: { nome: categoria_nome.trim() },
      defaults: { nome: categoria_nome.trim() }
    });

    // 2. Procurar ou criar a Editora
    const [editora] = await Editora.findOrCreate({
      where: { nome: editora_nome.trim() },
      defaults: { nome: editora_nome.trim() }
    });

    let capa_url = null;

    // 3. Processar Upload da Capa (se existir)
    if (capaFile) {
      const fileExt = capaFile.originalname.split('.').pop().toLowerCase();
      const fileName = `capa_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documente')
        .upload(fileName, capaFile.buffer, { contentType: capaFile.mimetype });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage.from('documente').getPublicUrl(fileName);
      capa_url = publicUrlData?.publicUrl || null;
    }

    // 4. Criar a Obra
    const novaObra = await Obra.create({
      titulo, 
      autor, 
      isbn, 
      ano_publicacao, 
      sinopse, 
      capa_url,
      tipo_recurso: tipo_recurso || 'fisico', 
      categoria_id: categoria.id,
      editora_id: editora.id 
    });

    // 5. Processar Upload do Ficheiro Digital (se existir e for digital/híbrido)
// 5. Processar Upload do Ficheiro Digital (se existir e for digital/híbrido)
    if (ficheiroFile) {
      const fileExt = ficheiroFile.originalname.split('.').pop().toLowerCase();
      const fileName = `digital_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documente')
        .upload(fileName, ficheiroFile.buffer, { contentType: ficheiroFile.mimetype });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('documente').getPublicUrl(fileName);
        
        // Guarda na tabela correspondente utilizando o model correto e o tamanho do ficheiro
        await FicheiroDigital.create({
          obra_id: novaObra.id,
          ficheiro_url: publicUrlData.publicUrl,
          tamanho_bytes: ficheiroFile.size, // Guarda o tamanho em bytes enviado pelo Multer (memoryStorage)
          formato: fileExt === 'epub' ? 'epub' : 'pdf'
        });
      } else {
        throw new Error(uploadError.message);
      }
    }j

    return res.status(201).json({ mensagem: 'Obra e ficheiros registados com sucesso!', novaObra });
  } catch (error) {
    console.error("Erro ao registar obra:", error);
    return res.status(500).json({ erro: 'Erro interno ao registar obra', detalhes: error.message });
  }
},

  async editarObra(req, res) {
    try {
      await Obra.update(req.body, { where: { id: req.params.id } });
      res.json({ mensagem: 'Obra atualizada com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao editar obra', detalhes: error.message });
    }
  },

  async eliminarObra(req, res) {
    try {
      const ficheiro = await FicheiroDigital.findOne({ where: { obra_id: req.params.id } });
      if (ficheiro) {
        const nomeFicheiro = ficheiro.ficheiro_url.split('/').pop();
        await supabase.storage.from('documente').remove([nomeFicheiro]);
      }
      await Obra.destroy({ where: { id: req.params.id } });
      res.json({ mensagem: 'Obra eliminada com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao eliminar obra', detalhes: error.message });
    }
  },

  async uploadFicheiroDigital(req, res) {
    try {
      const { obra_id } = req.params;
      const file = req.file;

      if (!file) return res.status(400).json({ error: 'Nenhum ficheiro enviado.' });

      const obra = await Obra.findByPk(obra_id);
      if (!obra) return res.status(404).json({ error: 'Obra não encontrada.' });

      const fileExt = file.originalname.split('.').pop().toLowerCase();
      const fileName = `obra_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documente')
        .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });

      if (uploadError) return res.status(500).json({ error: 'Erro Supabase: ' + uploadError.message });

      const { data: publicUrlData } = supabase.storage.from('documente').getPublicUrl(fileName);

      const novoFicheiro = await FicheiroDigital.create({
        obra_id,
        ficheiro_url: publicUrlData.publicUrl,
        formato: fileExt === 'epub' ? 'epub' : 'pdf',
        tamanho_bytes: file.size
      });

      return res.status(201).json({ message: 'Ficheiro enviado e registado com sucesso!', dados: novoFicheiro });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao processar o upload.' });
    }
  },

  async obterFicheiroDigital(req, res) {
    try {
      const ficheiro = await FicheiroDigital.findOne({ where: { obra_id: req.params.obra_id } });
      if (!ficheiro) return res.status(404).json({ error: 'Ficheiro digital não encontrado para esta obra.' });

      return res.status(200).json({ message: 'Ficheiro encontrado com sucesso!', dados: ficheiro });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao buscar o ficheiro.' });
    }
  }
};