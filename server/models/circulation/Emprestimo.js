const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Emprestimo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    data_emprestimo: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_limite_devolucao: { type: DataTypes.DATE, allowNull: false },
    data_devolucao_real: { type: DataTypes.DATE },
    renovacoes_restantes: { type: DataTypes.INTEGER, defaultValue: 2 },
    estado: {
      type: DataTypes.ENUM('ativo', 'atrasado', 'concluido'),
      defaultValue: 'ativo'
    }
  }, { tableName: 'emprestimos', timestamps: true });
};

//C:\Users\administrator\Documents\biblioteca_app\server\models\circulation\Emprestimo.js