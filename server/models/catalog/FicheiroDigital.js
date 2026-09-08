module.exports = (sequelize) => {
  const { DataTypes } = sequelize.Sequelize;

  return sequelize.define('FicheiroDigital', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    obra_id: { type: DataTypes.INTEGER, allowNull: false },
    ficheiro_url: { type: DataTypes.STRING, allowNull: false },
    formato: { type: DataTypes.ENUM('pdf', 'epub'), defaultValue: 'pdf' },
    tamanho_bytes: { type: DataTypes.BIGINT }
  }, { tableName: 'ficheiros_digitais', timestamps: true });
};