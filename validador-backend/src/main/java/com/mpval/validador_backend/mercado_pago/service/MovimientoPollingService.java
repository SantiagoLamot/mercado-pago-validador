package com.mpval.validador_backend.mercado_pago.service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.core.MPRequestOptions;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.net.MPResultsResourcesPage;
import com.mercadopago.net.MPSearchRequest;
import com.mercadopago.resources.payment.Payment;
import com.mpval.validador_backend.mercado_pago.entity.OauthToken;
import com.mpval.validador_backend.mercado_pago.repository.OauthTokenRepository;
import com.mpval.validador_backend.mercado_pago.util.MercadoPagoRateLimiter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Worker de respaldo: cubre pagos que no dispararon webhook (tipicamente
 * transferencias directas al alias/CVU). Recorre las cuentas conectadas
 * activas cuyo intervalo de chequeo vencio, consulta /v1/payments/search
 * desde el ultimo chequeo, dedupe+notifica via PagoDetectadoService, y ajusta
 * la frecuencia de chequeo de cada cuenta segun si hubo movimiento o no.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class MovimientoPollingService {

    private final OauthTokenRepository oauthTokenRepository;
    private final OauthTokenService oauthTokenService;
    private final PagoDetectadoService pagoDetectadoService;
    private final MercadoPagoRateLimiter rateLimiter;

    @Value("${polling.min-interval-seconds:30}")
    private int minIntervalSeconds;

    @Value("${polling.max-interval-seconds:300}")
    private int maxIntervalSeconds;

    @Scheduled(fixedDelay = 5000)
    public void verificarMovimientos() {
        LocalDateTime ahora = LocalDateTime.now();

        List<OauthToken> candidatas = oauthTokenRepository.findByActiveTrue().stream()
                .filter(cuenta -> cuenta.getUsuario() != null)
                .filter(cuenta -> Boolean.TRUE.equals(cuenta.getUsuario().getActivo()))
                .filter(cuenta -> cuenta.getUsuario().getExpiracionSuscripcion() != null
                        && cuenta.getUsuario().getExpiracionSuscripcion().isAfter(ahora))
                .filter(cuenta -> estaVencida(cuenta, ahora))
                .toList();

        if (candidatas.isEmpty()) {
            return;
        }

        int pagosNuevosTotal = 0;
        int rateLimitHits = 0;

        for (OauthToken cuenta : candidatas) {
            rateLimiter.acquire();
            try {
                pagosNuevosTotal += revisarCuenta(cuenta, ahora);
            } catch (MPApiException e) {
                if (e.getStatusCode() == 429) {
                    rateLimitHits++;
                    aplicarBackoff(cuenta);
                    log.warn("Rate limit (429) al consultar pagos de la cuenta MP {}, se espacia el proximo intento a {}s",
                            cuenta.getUserId(), cuenta.getCheckIntervalSeconds());
                } else {
                    log.error("Error de API de Mercado Pago revisando cuenta {}: {}", cuenta.getUserId(), e.getMessage());
                }
            } catch (Exception e) {
                log.error("Error revisando movimientos de la cuenta MP {}: {}", cuenta.getUserId(), e.getMessage(), e);
            }
        }

        log.info("Ciclo de polling: {} cuentas revisadas, {} pagos nuevos, {} rate-limit hits",
                candidatas.size(), pagosNuevosTotal, rateLimitHits);
    }

    private boolean estaVencida(OauthToken cuenta, LocalDateTime ahora) {
        if (cuenta.getLastCheckedAt() == null) {
            return true;
        }
        int intervalo = cuenta.getCheckIntervalSeconds() != null ? cuenta.getCheckIntervalSeconds() : minIntervalSeconds;
        return !cuenta.getLastCheckedAt().plusSeconds(intervalo).isAfter(ahora);
    }

    private int revisarCuenta(OauthToken cuentaOriginal, LocalDateTime ahora) throws MPException, MPApiException {
        OauthToken cuenta = oauthTokenService.refrescarSiNecesario(cuentaOriginal);
        String accessToken = oauthTokenService.desencriptarAccessToken(cuenta);

        LocalDateTime desde = cuenta.getLastCheckedAt() != null ? cuenta.getLastCheckedAt() : ahora.minusMinutes(5);

        Map<String, Object> filtros = new HashMap<>();
        filtros.put("sort", "date_created");
        filtros.put("criteria", "asc");
        filtros.put("range", "date_created");
        filtros.put("begin_date", formatear(desde));
        filtros.put("end_date", formatear(ahora));

        MPSearchRequest searchRequest = MPSearchRequest.builder()
                .limit(50)
                .filters(filtros)
                .build();

        PaymentClient client = new PaymentClient();
        MPResultsResourcesPage<Payment> resultado = client.search(
                searchRequest,
                MPRequestOptions.builder().accessToken(accessToken).build());

        List<Payment> pagos = resultado.getResults() != null ? resultado.getResults() : List.of();

        int nuevos = 0;
        for (Payment pago : pagos) {
            if (pagoDetectadoService.manejarPagoDetectado(cuenta, pago, "polling")) {
                nuevos++;
            }
        }

        cuenta.setLastCheckedAt(ahora);
        ajustarIntervalo(cuenta, nuevos > 0);
        oauthTokenRepository.save(cuenta);

        return nuevos;
    }

    private void ajustarIntervalo(OauthToken cuenta, boolean huboMovimiento) {
        int actual = cuenta.getCheckIntervalSeconds() != null ? cuenta.getCheckIntervalSeconds() : minIntervalSeconds;
        int nuevo = huboMovimiento
                ? minIntervalSeconds
                : Math.min(maxIntervalSeconds, (int) Math.ceil(actual * 1.5));
        cuenta.setCheckIntervalSeconds(Math.max(minIntervalSeconds, nuevo));
    }

    private void aplicarBackoff(OauthToken cuenta) {
        int actual = cuenta.getCheckIntervalSeconds() != null ? cuenta.getCheckIntervalSeconds() : minIntervalSeconds;
        cuenta.setCheckIntervalSeconds(Math.min(maxIntervalSeconds, actual * 2));
        oauthTokenRepository.save(cuenta);
    }

    private String formatear(LocalDateTime fecha) {
        OffsetDateTime odt = fecha.atZone(ZoneId.systemDefault()).toOffsetDateTime();
        return odt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }
}
