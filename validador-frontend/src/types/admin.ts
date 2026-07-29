export interface EmpresaResumen {
  id: number;
  nombreDeUsuario: string;
  correo: string;
  nombre: string;
  apellido: string;
  nombreEmpresa: string;
  expiracionSuscripcion: string | null;
  suscripcionActiva: boolean;
  activo: boolean;
  cuentaMpConectada: boolean;
  cuentaMpActiva: boolean;
  ultimoChequeoPolling: string | null;
}

export interface AltaEmpresaRequest {
  nombreDeUsuario: string;
  correo: string;
  nombre: string;
  apellido: string;
  nombreEmpresa: string;
}

export interface AltaEmpresaResponse {
  id: number;
  nombreDeUsuario: string;
  contrasenaTemporal: string;
}

export interface AjusteSuscripcionRequest {
  dias: number;
}

export interface SuscripcionMovimiento {
  id: number;
  dias: number | null;
  origen: 'MANUAL_ADMIN' | 'PAGO_MP';
  adminNombre: string | null;
  fechaExpiracionResultante: string | null;
  creadoEn: string;
}
