const sequelize = require('../config/database');

// Importação dos modelos
const Faculdade = require('./academic/Faculdade')(sequelize);
const Curso = require('./academic/Curso')(sequelize);
const Utilizador = require('./academic/Utilizador')(sequelize);

const Categoria = require('./catalog/Categoria')(sequelize);
const Editora = require('./catalog/Editora')(sequelize);
const Obra = require('./catalog/Obra')(sequelize);
const ExemplarFisico = require('./catalog/ExemplarFisico')(sequelize);
const FicheiroDigital = require('./catalog/FicheiroDigital')(sequelize);
const RepositorioTrabalho = require('./catalog/RepositorioTrabalho')(sequelize);

const Emprestimo = require('./circulation/Emprestimo')(sequelize);
const Reserva = require('./circulation/Reserva')(sequelize);

const Notificacao = require('./system/Notificacao')(sequelize);
const ConfiguracaoSistema = require('./system/ConfiguracaoSistema')(sequelize);
const LogSistema = require('./system/LogSistema')(sequelize);

// =========================================
// ASSOCIAÇÕES (RELAÇÕES ENTRE TABELAS)
// =========================================

// Faculdade <-> Curso
Faculdade.hasMany(Curso, { foreignKey: 'faculdade_id' });
Curso.belongsTo(Faculdade, { foreignKey: 'faculdade_id' });

// Curso <-> Utilizador
Curso.hasMany(Utilizador, { foreignKey: 'curso_id' });
Utilizador.belongsTo(Curso, { foreignKey: 'curso_id' });

// Faculdade e Curso <-> Repositório Académico
Faculdade.hasMany(RepositorioTrabalho, { foreignKey: 'faculdade_id' });
RepositorioTrabalho.belongsTo(Faculdade, { foreignKey: 'faculdade_id' });

Curso.hasMany(RepositorioTrabalho, { foreignKey: 'curso_id' });
RepositorioTrabalho.belongsTo(Curso, { foreignKey: 'curso_id' });

// Categoria e Editora <-> Obra
Categoria.hasMany(Obra, { foreignKey: 'categoria_id' });
Obra.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Editora.hasMany(Obra, { foreignKey: 'editora_id' });
Obra.belongsTo(Editora, { foreignKey: 'editora_id' });

// Obra <-> Exemplar Físico e Ficheiro Digital
Obra.hasMany(ExemplarFisico, { foreignKey: 'obra_id' });
ExemplarFisico.belongsTo(Obra, { foreignKey: 'obra_id' });

Obra.hasMany(FicheiroDigital, { foreignKey: 'obra_id' });
FicheiroDigital.belongsTo(Obra, { foreignKey: 'obra_id' });

// Empréstimos (Utilizador + Exemplar)
Utilizador.hasMany(Emprestimo, { foreignKey: 'utilizador_id' });
Emprestimo.belongsTo(Utilizador, { foreignKey: 'utilizador_id' });

ExemplarFisico.hasMany(Emprestimo, { foreignKey: 'exemplar_id' });
Emprestimo.belongsTo(ExemplarFisico, { foreignKey: 'exemplar_id' });

// Reservas (Utilizador + Obra)
Utilizador.hasMany(Reserva, { foreignKey: 'utilizador_id' });
Reserva.belongsTo(Utilizador, { foreignKey: 'utilizador_id' });

Obra.hasMany(Reserva, { foreignKey: 'obra_id' });
Reserva.belongsTo(Obra, { foreignKey: 'obra_id' });

// Notificações e Logs
Utilizador.hasMany(Notificacao, { foreignKey: 'utilizador_id' });
Notificacao.belongsTo(Utilizador, { foreignKey: 'utilizador_id' });

Utilizador.hasMany(LogSistema, { foreignKey: 'utilizador_id' });
LogSistema.belongsTo(Utilizador, { foreignKey: 'utilizador_id' });

// 💡 Adicionado "as: 'ficheiro'" (ou 'ficheiros' dependendo de como chama no controller)
Obra.hasMany(FicheiroDigital, { foreignKey: 'obra_id', as: 'ficheiro' });
FicheiroDigital.belongsTo(Obra, { foreignKey: 'obra_id' });

module.exports = {
  sequelize,
  Faculdade,
  Curso,
  Utilizador,
  Categoria,
  Editora,
  Obra,
  ExemplarFisico,
  FicheiroDigital,
  RepositorioTrabalho,
  Emprestimo,
  Reserva,
  Notificacao,
  ConfiguracaoSistema,
  LogSistema
};