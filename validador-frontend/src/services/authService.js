import api from './api';

export const registerUser = async (form) => {
  const response = await api.post('/auth/register', form);
  return response.data;
};

export const loginUser = async (form) => {
  const response = await api.post('/auth/login', form);
  return response.data;
};

export const logoutUser = async () => {
  const token = sessionStorage.getItem('accessToken');
  if (!token) throw new Error('No hay token para cerrar sesión');

  try {
    await api.post(
      '/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
  } finally {
    sessionStorage.clear(); // 🧹 Limpia todo
    window.dispatchEvent(new Event('authChange')); // 🔄 Actualiza el contexto
  }
};