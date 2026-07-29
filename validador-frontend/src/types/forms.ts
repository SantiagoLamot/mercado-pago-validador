export interface LoginForm {
  nombreDeUsuario: string;
  contrasena: string;
}

export interface RegisterForm {
  nombreDeUsuario: string;
  correo: string;
  contrasena: string;
  nombre: string;
  apellido: string;
  empresa: string;
}

export interface CambiarContrasenaForm {
  contrasenaActual: string;
  contrasenaNueva: string;
  repetirContrasena: string;
}
