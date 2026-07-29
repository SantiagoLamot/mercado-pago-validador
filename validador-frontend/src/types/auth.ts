export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  userName: string;
  oauth: boolean;
  licencia: boolean;
  vencimientoLicencia: string;
  rol: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreEmpresa: string;
}

export interface AuthState {
  username: string;
  accessToken: string;
  refreshToken: string;
  licencia: boolean;
  oauth: boolean;
  vencimientoLicencia: string;
  rol: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreEmpresa: string;
}

export const EMPTY_AUTH_STATE: AuthState = {
  username: '',
  accessToken: '',
  refreshToken: '',
  licencia: false,
  oauth: false,
  vencimientoLicencia: '',
  rol: '',
  nombre: '',
  apellido: '',
  correo: '',
  nombreEmpresa: '',
};
