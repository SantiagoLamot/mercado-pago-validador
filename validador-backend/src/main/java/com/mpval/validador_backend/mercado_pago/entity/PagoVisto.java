package com.mpval.validador_backend.mercado_pago.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "pagos_vistos_tb")
public class PagoVisto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long mpPaymentId;

    @ManyToOne
    @JoinColumn(name = "mp_account_id", nullable = false)
    private OauthToken cuenta;

    private BigDecimal amount;
    private String operationType;
    private String paymentTypeId;
    private LocalDateTime dateCreated;
    private LocalDateTime notifiedAt;
}
