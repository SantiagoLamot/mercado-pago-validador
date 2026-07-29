import api from './api';
import type {
  AjusteSuscripcionRequest,
  AltaEmpresaRequest,
  AltaEmpresaResponse,
  EmpresaResumen,
  SuscripcionMovimiento,
} from '../types/admin';

export const listarEmpresas = async (): Promise<EmpresaResumen[]> => {
  const response = await api.get<EmpresaResumen[]>('/admin/empresas');
  return response.data;
};

export const altaEmpresa = async (form: AltaEmpresaRequest): Promise<AltaEmpresaResponse> => {
  const response = await api.post<AltaEmpresaResponse>('/admin/empresas', form);
  return response.data;
};

export const ajustarSuscripcion = async (id: number, ajuste: AjusteSuscripcionRequest): Promise<EmpresaResumen> => {
  const response = await api.patch<EmpresaResumen>(`/admin/empresas/${id}/suscripcion`, ajuste);
  return response.data;
};

export const cambiarEstadoEmpresa = async (id: number, activo: boolean): Promise<EmpresaResumen> => {
  const response = await api.patch<EmpresaResumen>(`/admin/empresas/${id}/estado`, { activo });
  return response.data;
};

export const resetearContrasenaEmpresa = async (id: number): Promise<AltaEmpresaResponse> => {
  const response = await api.post<AltaEmpresaResponse>(`/admin/empresas/${id}/reset-password`);
  return response.data;
};

export const historialSuscripcion = async (id: number): Promise<SuscripcionMovimiento[]> => {
  const response = await api.get<SuscripcionMovimiento[]>(`/admin/empresas/${id}/historial-suscripcion`);
  return response.data;
};

export const obtenerPrecioMensual = async (): Promise<number> => {
  const response = await api.get<number>('/admin/configuracion');
  return response.data;
};

export const actualizarPrecioMensual = async (precioMensual: number): Promise<number> => {
  const response = await api.put<number>('/admin/configuracion', { precioMensual });
  return response.data;
};
