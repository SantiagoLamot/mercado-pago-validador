import axios from 'axios';

const api = axios.create({
  baseURL: 'https://generous-evenly-skylark.ngrok-free.app', //http://localhost:8080       https://generous-evenly-skylark.ngrok-free.app      https://all-cycles-stay.loca.lt'
  headers: {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;