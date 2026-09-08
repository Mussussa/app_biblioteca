const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('RepositorioTrabalho', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    titulo: { type: DataTypes.STRING, allowNull: false },
    autor_estudante: { type: DataTypes.STRING, allowNull: false },
    supervisor_docente: { type: DataTypes.STRING },
    ano_defesa: { type: DataTypes.INTEGER, allowNull: false },
    pdf_url: { type: DataTypes.STRING, allowNull: false },
    tipo_trabalho: {
      type: DataTypes.ENUM('tcc', 'monografia', 'dissertacao', 'artigo'),
      defaultValue: 'tcc'
    }
  }, { tableName: 'repositorio_trabalhos', timestamps: true });
};