const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Utilizador', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome_completo: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    palavra_passe_hash: { type: DataTypes.STRING, allowNull: false },
    telefone: { type: DataTypes.STRING },
    perfil: {
      type: DataTypes.ENUM('estudante', 'docente', 'bibliotecario', 'admin'),
      allowNull: false,
      defaultValue: 'estudante'
    },
    codigo_institucional: { type: DataTypes.STRING, unique: true },
    foto_url: { type: DataTypes.STRING },
    qr_code_token: { type: DataTypes.STRING, unique: true },
    estado: {
      type: DataTypes.ENUM('ativo', 'suspenso'),
      defaultValue: 'ativo'
    }
  }, { tableName: 'utilizadores', timestamps: true });
};