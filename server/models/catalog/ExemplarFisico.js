const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ExemplarFisico', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codigo_exemplar: { type: DataTypes.STRING, allowNull: false, unique: true },
    bloco: { type: DataTypes.STRING },
    estante: { type: DataTypes.STRING },
    prateleira: { type: DataTypes.STRING },
    localizacao_prateleira: { type: DataTypes.STRING },
    codigo_localizacao: { type: DataTypes.STRING },
    tipo:{
      type: DataTypes.STRING ,
      defaultValue: "fisico"
    },
    estado: {
      type: DataTypes.ENUM('disponivel', 'emprestado', 'reservado', 'manutencao'),
      defaultValue: 'disponivel'
    }
  }, { tableName: 'exemplares_fisicos', timestamps: true });
};

//