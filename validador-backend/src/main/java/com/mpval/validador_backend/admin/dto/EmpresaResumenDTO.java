package com.mpval.validador_backend.admin.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpresaResumenDTO {
    private Long id;
    private String nombreDeUsuario;
    private String correo;
    private String nombre;
    private String apellido;
    private String nombreEmpresa;
    private LocalDateTime expiracionSuscripcion;
    private boolean suscripcionActiva;
    private boolean activo;
    private boolean cuentaMpConectada;
    private boolean cuentaMpActiva;
    private LocalDateTime ultimoChequeoPolling;
}
