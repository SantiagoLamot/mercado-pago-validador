package com.mpval.validador_backend.mercado_pago.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "configuracion_suscripcion_tb")
public class ConfiguracionSuscripcion {
    @Id
    private Long id;

    private BigDecimal precioMensual;
    private Long actualizadoPorAdminId;
    private LocalDateTime actualizadoEn;
}
