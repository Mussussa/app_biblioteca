const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Editora', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false }
  }, { tableName: 'editoras', timestamps: true });
};