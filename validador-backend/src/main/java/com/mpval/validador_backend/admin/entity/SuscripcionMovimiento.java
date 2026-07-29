package com.mpval.validador_backend.admin.entity;

import java.time.LocalDateTime;

import com.mpval.validador_backend.Usuario.entity.Usuario;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Historial de cambios a la suscripcion de una empresa: manuales (admin) o automaticos (pago MP). */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "suscripcion_movimientos_tb")
public class SuscripcionMovimiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    /** Dias sumados (positivo) o quitados (negativo). Null si se fijo una fecha exacta. */
    private Integer dias;

    @Enumerated(EnumType.STRING)
    private OrigenMovimientoSuscripcion origen;

    /** Admin que hizo el cambio manual; null si origen=PAGO_MP. */
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Usuario admin;

    private LocalDateTime fechaExpiracionResultante;
    private LocalDateTime creadoEn;
}
