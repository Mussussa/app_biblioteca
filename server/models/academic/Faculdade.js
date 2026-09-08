const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Faculdade', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    sigla: { type: DataTypes.STRING(10), allowNull: false }
  }, { tableName: 'faculdades', timestamps: true });
};

//C:\Users\administrator\Documents\biblioteca_app\server\models\academic\Faculdade.js