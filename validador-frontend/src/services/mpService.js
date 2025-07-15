import api from './api';

export const iniciarPagoSuscripcion = async (param) => {
  const response = await api.get(`/pago/suscripcion?param=${encodeURIComponent(param)}`);
  return response.data; // devuelve el link de pago
};