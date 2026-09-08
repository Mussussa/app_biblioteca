const { Utilizador ,Faculdade, Curso, Categoria, Editora } = require('../models');

module.exports = {
  // ==========================================
  // GESTÃO DE FACULDADES
  // ==========================================
  async criarFaculdade(req, res) {
    try {
      const { nome, sigla } = req.body;
      const novaFaculdade = await Faculdade.create({ nome, sigla });
      res.status(201).json({ mensagem: 'Faculdade criada com sucesso!', novaFaculdade });
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao criar faculdade', detalhes: error.message });
    }
  },

  async listarFaculdades(req, res) {
    try {
      const faculdades = await Faculdade.findAll();
      res.json(faculdades);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar faculdades', detalhes: error.message });
    }
  },

  // ==========================================
  // GESTÃO DE CURSOS
  // ==========================================
  async criarCurso(req, res) {
    try {
      const { nome, faculdade_id } = req.body;
      
      const faculdade = await Faculdade.findByPk(faculdade_id);
      if (!faculdade) {
        return res.status(404).json({ erro: 'Faculdade não encontrada.' });
      }

      const novoCurso = await Curso.create({ nome, faculdade_id });
      res.status(201).json({ mensagem: 'Curso criado com sucesso!', novoCurso });
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao criar curso', detalhes: error.message });
    }
  },

  async listarCursos(req, res) {
    try {
      const cursos = await Curso.findAll({
        include: [{ model: Faculdade, attributes: ['nome'] }]
      });
      res.json(cursos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar cursos', detalhes: error.message });
    }
  },

  // ==========================================
  // GESTÃO DE CATEGORIAS E EDITORAS (Para Obras)
  // ==========================================
  async criarCategoria(req, res) {
    try {
      const { nome, descricao } = req.body;
      const novaCategoria = await Categoria.create({ nome, descricao });
      res.status(201).json({ mensagem: 'Categoria criada com sucesso!', novaCategoria });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar categoria', detalhes: error.message });
    }
  },

  async criarEditora(req, res) {
    try {
      const { nome, pais } = req.body;
      const novaEditora = await Editora.create({ nome, pais });
      res.status(201).json({ mensagem: 'Editora criada com sucesso!', novaEditora });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar editora', detalhes: error.message });
    }
  } ,
  // ==========================================
  // GESTÃO DE UTILIZADORES
  // ==========================================
  async listarUtilizadores(req, res) {
    try {
      const utilizadores = await Utilizador.findAll({
        include: [{ model: Curso, include: [Faculdade] }],
        attributes: { exclude: ['palavra_passe_hash'] }, // Ocultar a senha por segurança
        order: [['createdAt', 'DESC']]
      });
      res.json(utilizadores);
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao listar utilizadores', detalhes: error.message });
    }
  },

  async atualizarUtilizador(req, res) {
    try {
      const { id } = req.params;
      const { perfil, estado, curso_id } = req.body;

      const utilizador = await Utilizador.findByPk(id);
      if (!utilizador) {
        return res.status(404).json({ erro: 'Utilizador não encontrado.' });
      }

      if (perfil) utilizador.perfil = perfil;
      if (estado) utilizador.estado = estado;
      if (curso_id) utilizador.curso_id = curso_id;

      await utilizador.save();

      res.json({ mensagem: 'Utilizador atualizado com sucesso!', utilizador });
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao atualizar utilizador', detalhes: error.message });
    }
  },

  async eliminarUtilizador(req, res) {
    try {
      const { id } = req.params;
      const utilizador = await Utilizador.findByPk(id);
      if (!utilizador) {
        return res.status(404).json({ erro: 'Utilizador não encontrado.' });
      }

      await utilizador.destroy();
      res.json({ mensagem: 'Utilizador eliminado com sucesso!' });
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao eliminar utilizador', detalhes: error.message });
    }
  },
};