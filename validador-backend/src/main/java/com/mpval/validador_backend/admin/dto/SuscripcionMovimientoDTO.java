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
public class SuscripcionMovimientoDTO {
    private Long id;
    private Integer dias;
    private String origen;
    private String adminNombre;
    private LocalDateTime fechaExpiracionResultante;
    private LocalDateTime creadoEn;
}
