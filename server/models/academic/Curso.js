const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Curso', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING, allowNull: false }
  }, { tableName: 'cursos', timestamps: true });
};
//C:\Users\administrator\Documents\biblioteca_app\server\models\academic\Curso.js