package com.mpval.validador_backend.mercado_pago.dto;

import java.util.List;

import com.mpval.validador_backend.mercado_pago.entity.Movimiento;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoResponse {
    private List<Movimiento> movimientos;
}
