const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Obra', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    autor: { type: DataTypes.STRING, allowNull: false },
    isbn: { type: DataTypes.STRING },
    ano_publicacao: { type: DataTypes.INTEGER },
    sinopse: { type: DataTypes.TEXT },
    capa_url: { type: DataTypes.STRING },
tipo_recurso: {
  type: DataTypes.ENUM('fisico', 'Físico', 'digital', 'Digital', 'hibrido', 'Híbrido'),
  defaultValue: 'fisico'
}
  }, { tableName: 'obras', timestamps: true });
};

//C:\Users\administrator\Documents\biblioteca_app\server\models\catalog\Obra.js