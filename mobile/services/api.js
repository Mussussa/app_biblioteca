import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://dinah-ectomorphic-coralie.ngrok-free.dev'; 

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    // ⚠️ Obrigatório para o Ngrok não retornar página HTML de aviso ao testar via browser/app web
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error('[API Interceptor] Erro ao ler token:', err);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;