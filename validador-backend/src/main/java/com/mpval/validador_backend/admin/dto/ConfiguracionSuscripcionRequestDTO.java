package com.mpval.validador_backend.admin.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ConfiguracionSuscripcionRequestDTO {
    @NotNull
    @Positive
    private BigDecimal precioMensual;
}
