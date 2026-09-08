const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Notificacao', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    mensagem: { type: DataTypes.TEXT, allowNull: false },
    lida: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'notificacoes', timestamps: true });
};