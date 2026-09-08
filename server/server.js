const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const bibliotecarioRotas = require('./routes/bibliotecarioRoutes');
const docenteRoutes = require('./routes/docenteRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicoRoutes = require('./routes/publicoRoutes');
const perfilRoutes = require('./routes/perfilRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor I.J.bibliotecaApp ativo!' });
});
app.use('/api/bibliotecario', bibliotecarioRotas);
app.use('/api/docente', docenteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicoRoutes);
app.use('/api/perfil', perfilRoutes);



sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tabelas sincronizadas no banco de dados!');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ou sincronizar o banco:', err);
  });