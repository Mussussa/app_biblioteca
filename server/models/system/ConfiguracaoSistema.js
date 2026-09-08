const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ConfiguracaoSistema', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chave: { type: DataTypes.STRING, allowNull: false, unique: true },
    valor: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.STRING }
  }, { tableName: 'configuracoes_sistema', timestamps: true });
};