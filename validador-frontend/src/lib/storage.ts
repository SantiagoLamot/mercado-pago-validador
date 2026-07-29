import type { AuthState, TokenResponse } from '../types/auth';
import { EMPTY_AUTH_STATE } from '../types/auth';

export const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  username: 'username',
  licencia: 'licencia',
  oauth: 'oauth',
  vencimientoLicencia: 'vencimientoLicencia',
  rol: 'rol',
  nombre: 'nombre',
  apellido: 'apellido',
  correo: 'correo',
  nombreEmpresa: 'nombreEmpresa',
} as const;

export function tokenResponseToAuthState(response: TokenResponse): AuthState {
  return {
    username: response.userName,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    licencia: response.licencia,
    oauth: response.oauth,
    vencimientoLicencia: response.vencimientoLicencia ?? '',
    rol: response.rol ?? '',
    nombre: response.nombre ?? '',
    apellido: response.apellido ?? '',
    correo: response.correo ?? '',
    nombreEmpresa: response.nombreEmpresa ?? '',
  };
}

export function readAuthSnapshot(): AuthState {
  return {
    username: sessionStorage.getItem(STORAGE_KEYS.username) ?? '',
    accessToken: sessionStorage.getItem(STORAGE_KEYS.accessToken) ?? '',
    refreshToken: sessionStorage.getItem(STORAGE_KEYS.refreshToken) ?? '',
    licencia: sessionStorage.getItem(STORAGE_KEYS.licencia) === 'true',
    oauth: sessionStorage.getItem(STORAGE_KEYS.oauth) === 'true',
    vencimientoLicencia: sessionStorage.getItem(STORAGE_KEYS.vencimientoLicencia) ?? '',
    rol: sessionStorage.getItem(STORAGE_KEYS.rol) ?? '',
    nombre: sessionStorage.getItem(STORAGE_KEYS.nombre) ?? '',
    apellido: sessionStorage.getItem(STORAGE_KEYS.apellido) ?? '',
    correo: sessionStorage.getItem(STORAGE_KEYS.correo) ?? '',
    nombreEmpresa: sessionStorage.getItem(STORAGE_KEYS.nombreEmpresa) ?? '',
  };
}

export function writeAuthSnapshot(state: AuthState): void {
  sessionStorage.setItem(STORAGE_KEYS.username, state.username);
  sessionStorage.setItem(STORAGE_KEYS.accessToken, state.accessToken);
  sessionStorage.setItem(STORAGE_KEYS.refreshToken, state.refreshToken);
  sessionStorage.setItem(STORAGE_KEYS.licencia, String(state.licencia));
  sessionStorage.setItem(STORAGE_KEYS.oauth, String(state.oauth));
  sessionStorage.setItem(STORAGE_KEYS.vencimientoLicencia, state.vencimientoLicencia);
  sessionStorage.setItem(STORAGE_KEYS.rol, state.rol);
  sessionStorage.setItem(STORAGE_KEYS.nombre, state.nombre);
  sessionStorage.setItem(STORAGE_KEYS.apellido, state.apellido);
  sessionStorage.setItem(STORAGE_KEYS.correo, state.correo);
  sessionStorage.setItem(STORAGE_KEYS.nombreEmpresa, state.nombreEmpresa);
}

export function clearAuthSnapshot(): AuthState {
  sessionStorage.clear();
  return EMPTY_AUTH_STATE;
}
