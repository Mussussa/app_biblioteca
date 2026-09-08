const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('LogSistema', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    acao: { type: DataTypes.STRING, allowNull: false },
    detalhes: { type: DataTypes.TEXT }
  }, { tableName: 'logs_sistema', timestamps: true });
};