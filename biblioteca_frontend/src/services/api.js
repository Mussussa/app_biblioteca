import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ajusta para a porta correta do teu backend se necessário
});

// Injetar o token JWT em cada requisição se ele existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;