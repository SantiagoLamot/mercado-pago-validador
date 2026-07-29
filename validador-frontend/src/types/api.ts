export interface PagoNotificacion {
  mensaje: string;
  monto: number;
  email: string;
  hora: string;
  operationType: string;
  paymentTypeId: string;
  origen: string;
}

export interface EstadoUsuario {
  userName: string;
  licencia: boolean;
  vencimientoLicencia: string;
}
