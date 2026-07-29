import api from './api';

export const iniciarPagoSuscripcion = async (): Promise<string> => {
  const response = await api.get<string>('/pago/suscripcion');
  return response.data;
};

export const iniciarOauth = async (): Promise<string> => {
  const response = await api.get<string>('/oauth/init');
  return response.data;
};
