const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Reserva', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codigo_reserva: { type: DataTypes.STRING, allowNull: false, unique: true },
    data_reserva: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    data_limite_levantamento: { type: DataTypes.DATE },
    estado: {
      type: DataTypes.ENUM('pendente', 'pronto_levantamento', 'cancelado', 'concluido'),
      defaultValue: 'pendente'
    },
    exemplar_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'exemplares_fisicos', // ou o nome correto da tabela de exemplares
    key: 'id'
  }
}
  }, { 
    tableName: 'reservas', 
    timestamps: true,
    hooks: {
      beforeValidate: (reserva) => {
        if (!reserva.codigo_reserva) {
          const numeroAleatorio = Math.floor(10000 + Math.random() * 90000);
          reserva.codigo_reserva = `RB-${numeroAleatorio}`;
        }
      }
    }
  });
};

//C:\Users\administrator\Documents\biblioteca_app\server\models\circulation\Reserva.js