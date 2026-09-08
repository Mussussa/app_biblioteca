const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Categoria', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT }
  }, { tableName: 'categorias', timestamps: true });
};