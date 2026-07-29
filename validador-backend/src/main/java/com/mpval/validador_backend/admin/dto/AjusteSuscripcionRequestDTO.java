package com.mpval.validador_backend.admin.dto;

import lombok.Data;

@Data
public class AjusteSuscripcionRequestDTO {
    /** Dias a sumar a la expiracion vigente (si ya vencio, se suman desde hoy). */
    private Integer dias;
    /** Alternativa: fijar una fecha de expiracion exacta, formato ISO (yyyy-MM-ddTHH:mm:ss). */
    private String fechaExpiracion;
}
