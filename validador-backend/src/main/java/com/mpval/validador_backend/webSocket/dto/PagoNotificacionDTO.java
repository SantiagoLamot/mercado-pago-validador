package com.mpval.validador_backend.webSocket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagoNotificacionDTO {
    private String mensaje;
    private Double monto;
    private String nombreComprador;
}

