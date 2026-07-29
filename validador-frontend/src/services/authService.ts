import api from './api';
import type { TokenResponse } from '../types/auth';
import type { LoginForm, RegisterForm } from '../types/forms';

export const registerUser = async (form: RegisterForm): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>('/auth/register', form);
  return response.data;
};

export const loginUser = async (form: LoginForm): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>('/auth/login', form);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
  }
};

export const cambiarContrasena = async (contrasenaActual: string, contrasenaNueva: string): Promise<void> => {
  await api.patch('/usuario/password', { contrasenaActual, contrasenaNueva });
};
