const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilizador, Curso, Faculdade } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // 1. Inscrição / Registo (Perfil fixo como 'estudante')
  async registar(req, res) {
    try {
      const { nome_completo, email, palavra_passe, codigo_institucional, curso_id } = req.body;

      const utilizadorExistente = await Utilizador.findOne({ where: { email } });
      if (utilizadorExistente) {
        return res.status(400).json({ erro: 'Já existe um utilizador registado com este email.' });
      }

      const salt = await bcrypt.genSalt(10);
      const palavra_passe_hash = await bcrypt.hash(palavra_passe, salt);

      const novoUtilizador = await Utilizador.create({
        nome_completo,
        email,
        palavra_passe_hash,
        codigo_institucional,
        perfil: 'estudante', // Padrão obrigatório no registo
        curso_id
      });

      res.status(201).json({
        mensagem: 'Inscrição efetuada com sucesso!',
        utilizador: {
          id: novoUtilizador.id,
          nome: novoUtilizador.nome_completo,
          email: novoUtilizador.email,
          perfil: novoUtilizador.perfil,
          codigo: novoUtilizador.codigo_institucional
        }
      });
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao registar utilizador', detalhes: error.message });
    }
  },

  // 2. Login de Utilizador
  async login(req, res) {
    try {
      const { codigo_institucional, email, palavra_passe } = req.body;
      const identificador = codigo_institucional || email;

      if (!identificador) {
        return res.status(400).json({ erro: 'Por favor, insira o código institucional ou email.' });
      }

      const utilizador = await Utilizador.findOne({
        where: {
          [Op.or]: [
            { codigo_institucional: identificador },
            { email: identificador }
          ]
        },
        include: [{ model: Curso, include: [Faculdade] }]
      });

      if (!utilizador) {
        return res.status(401).json({ erro: 'Credenciais inválidas (Utilizador não encontrado).' });
      }

      const senhaValida = await bcrypt.compare(palavra_passe, utilizador.palavra_passe_hash);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Credenciais inválidas (Palavra-passe incorreta).' });
      }

      const token = jwt.sign(
        { id: utilizador.id, perfil: utilizador.perfil },
        process.env.JWT_SECRET || 'chave_secreta_super_segura',
        { expiresIn: '7d' }
      );

      res.json({
        mensagem: 'Login efetuado com sucesso!',
        token,
        utilizador: {
          id: utilizador.id,
          nome: utilizador.nome_completo,
          email: utilizador.email,
          codigo: utilizador.codigo_institucional,
          perfil: utilizador.perfil, // Retorna 'estudante', 'bibliotecario' ou 'admin' do banco
          curso: utilizador.Curso ? utilizador.Curso.nome : null,
          faculdade: utilizador.Curso && utilizador.Curso.Faculdade ? utilizador.Curso.Faculdade.nome : null
        }
      });
    } catch (error) {
      console.log("Erro no servidor", error);
      res.status(500).json({ erro: 'Erro ao efetuar login', detalhes: error.message });
    }
  },

  // 3. Logout
  async logout(req, res) {
    return res.status(200).json({ mensagem: 'Logout efetuado com sucesso!' });
  }
};