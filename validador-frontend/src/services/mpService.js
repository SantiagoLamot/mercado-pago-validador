import api from './api';

export const iniciarPagoSuscripcion = async () => {
  const response = await api.get('/pago/suscripcion');
  return response.data; // devuelve el link de pago
};

export const iniciarOauth = async () => {
  const response = await api.get('/oauth/init');
  return response.data;
};