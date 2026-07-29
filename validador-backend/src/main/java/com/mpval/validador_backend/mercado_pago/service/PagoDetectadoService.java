package com.mpval.validador_backend.mercado_pago.service;

import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.stereotype.Service;

import com.mercadopago.resources.payment.Payment;
import com.mpval.validador_backend.mercado_pago.entity.OauthToken;
import com.mpval.validador_backend.mercado_pago.entity.PagoVisto;
import com.mpval.validador_backend.mercado_pago.repository.PagoVistoRepository;
import com.mpval.validador_backend.webSocket.dto.PagoNotificacionDTO;
import com.mpval.validador_backend.webSocket.service.NotificacionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Punto unico de deteccion de "recibiste un pago": lo llaman tanto el webhook
 * como el polling de respaldo. Deduplica por mp_payment_id y dispara la
 * notificacion al negocio una sola vez por pago.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PagoDetectadoService {

    private final PagoVistoRepository pagoVistoRepository;
    private final NotificacionService notificacionService;

    /**
     * @return true si el pago era nuevo (se notifico), false si ya se habia visto antes.
     */
    public boolean manejarPagoDetectado(OauthToken cuenta, Payment payment, String origen) {
        if (pagoVistoRepository.existsByMpPaymentId(payment.getId())) {
            log.debug("Pago {} ya fue notificado antes (origen actual: {}), se ignora", payment.getId(), origen);
            return false;
        }

        LocalDateTime fechaCreacion = payment.getDateCreated() != null
                ? payment.getDateCreated().atZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime()
                : LocalDateTime.now();

        PagoVisto pagoVisto = PagoVisto.builder()
                .mpPaymentId(payment.getId())
                .cuenta(cuenta)
                .amount(payment.getTransactionAmount())
                .operationType(payment.getOperationType())
                .paymentTypeId(payment.getPaymentTypeId())
                .dateCreated(fechaCreacion)
                .notifiedAt(LocalDateTime.now())
                .build();
        pagoVistoRepository.save(pagoVisto);

        PagoNotificacionDTO dto = PagoNotificacionDTO.builder()
                .mensaje("Recibiste un nuevo pago")
                .monto(payment.getTransactionAmount() != null ? payment.getTransactionAmount().doubleValue() : null)
                .hora(LocalDateTime.now())
                .operationType(payment.getOperationType())
                .paymentTypeId(payment.getPaymentTypeId())
                .origen(origen)
                .build();

        String nombreDeUsuario = cuenta.getUsuario().getNombreDeUsuario();
        notificacionService.notificarPagoAUsuario(nombreDeUsuario, dto);

        log.info("Pago nuevo detectado via {} - cuenta MP {} (empresa {}), monto {}, tipo {}",
                origen, cuenta.getUserId(), nombreDeUsuario, dto.getMonto(), dto.getPaymentTypeId());
        return true;
    }
}
