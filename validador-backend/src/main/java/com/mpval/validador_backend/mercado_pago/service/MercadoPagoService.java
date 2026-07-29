package com.mpval.validador_backend.mercado_pago.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.core.MPRequestOptions;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import com.mpval.validador_backend.Usuario.entity.Usuario;
import com.mpval.validador_backend.Usuario.repository.UsuarioRepository;
import com.mpval.validador_backend.admin.entity.OrigenMovimientoSuscripcion;
import com.mpval.validador_backend.admin.entity.SuscripcionMovimiento;
import com.mpval.validador_backend.admin.repository.SuscripcionMovimientoRepository;
import com.mpval.validador_backend.jwt.service.JwtService;
import com.mpval.validador_backend.mercado_pago.dto.EstadoUsuarioDTO;
import com.mpval.validador_backend.mercado_pago.dto.WebhookDTO;
import com.mpval.validador_backend.mercado_pago.entity.ConfiguracionSuscripcion;
import com.mpval.validador_backend.mercado_pago.entity.OauthToken;
import com.mpval.validador_backend.mercado_pago.entity.Transaccion;
import com.mpval.validador_backend.mercado_pago.repository.ConfiguracionSuscripcionRepository;
import com.mpval.validador_backend.mercado_pago.repository.OauthTokenRepository;
import com.mpval.validador_backend.mercado_pago.repository.TransaccionRepository;
import com.mpval.validador_backend.mercado_pago.util.EncriptadoUtil;
import com.mpval.validador_backend.webSocket.service.NotificacionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MercadoPagoService {

    @Value("${clientId}")
    String clientId;

    @Value("${clientSecret}")
    String clientSecret;

    @Value("${mercadopago.access-token}")
    String accessToken;

    private final UsuarioRepository usuariosRepository;
    private final NotificacionService notificacionService;
    private final JwtService jwtService;
    private final TransaccionRepository transaccionRepository;
    private final OauthTokenRepository oauthTokenRepository;
    private final PagoDetectadoService pagoDetectadoService;
    private final ConfiguracionSuscripcionRepository configuracionSuscripcionRepository;
    private final EncriptadoUtil encriptadoUtil;
    private final SuscripcionMovimientoRepository suscripcionMovimientoRepository;

    // ================ LINK PARA PAGAR SUSCRIP ================
    public String pagarSuscripcioninit() throws MPException, MPApiException{
        Transaccion nueva = new Transaccion();
        Usuario usuario = usuariosRepository.findByNombreDeUsuario(jwtService.obtenerNombreDeUsuarioAutenticado())
        .orElseThrow(()-> new RuntimeException("Error con usuario logueado"));
        nueva.setUsuario(usuario);
        Transaccion transaccion = transaccionRepository.save(nueva);

        MercadoPagoConfig.setAccessToken(accessToken);

        BigDecimal precioMensual = configuracionSuscripcionRepository.findById(1L)
                .map(ConfiguracionSuscripcion::getPrecioMensual)
                .orElse(BigDecimal.valueOf(5000));

        PreferenceItemRequest item = PreferenceItemRequest.builder()
        .title("30 dias de suscripcion a MP Validador")
        .quantity(1)
        .currencyId("ARG")
        .unitPrice(precioMensual)
        .build();

        OffsetDateTime ahora = OffsetDateTime.now();
        OffsetDateTime expiracion = ahora.plusMinutes(60);

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
        .items(List.of(item))
        .externalReference(transaccion.getId().toString())
        .expires(true)
        .expirationDateFrom(ahora)
        .expirationDateTo(expiracion)
        .build();
        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);
        log.info("Preferencia de suscripcion creada para {}: {}", usuario.getNombreDeUsuario(), preference.getId());

        return preference.getInitPoint();
    }

    // ================ WEBHOOK ================
    @Async
    public void procesarWebhookAsync(WebhookDTO webhook) {
        procesarWebhook(webhook);
    }

    public void procesarWebhook(WebhookDTO webhook) {
        if (!"payment".equalsIgnoreCase(webhook.getType())) {
            log.debug("Webhook ignorado: tipo no soportado {}", webhook.getType());
            return;
        }
        try {
            Long paymentId = webhook.getData().getId();

            // Si el user_id del webhook matchea una cuenta MP conectada, es un pago
            // recibido por un negocio (checkout/QR/link/Point o transferencia directa) -
            // hay que consultarlo con el access_token de ESA cuenta, no con el de la app.
            OauthToken cuentaConectada = webhook.getUser_id() != null
                    ? oauthTokenRepository.findByUserId(webhook.getUser_id()).orElse(null)
                    : null;

            PaymentClient client = new PaymentClient();
            Payment payment = cuentaConectada != null
                    ? client.get(paymentId, MPRequestOptions.builder()
                            .accessToken(encriptadoUtil.desencriptar(cuentaConectada.getAccessToken()))
                            .build())
                    : client.get(paymentId);

            if (payment == null) {
                throw new RuntimeException("el payment es nulo");
            }

            if (cuentaConectada != null) {
                pagoDetectadoService.manejarPagoDetectado(cuentaConectada, payment, "webhook");
                return;
            }

            // Si no, es el pago de la suscripcion propia del SaaS (via externalReference -> Transaccion)
            String estado = payment.getStatus();
            String externalReference = payment.getExternalReference();
            Long transactionId = Long.parseLong(externalReference);
            Transaccion transaccion = transaccionRepository.findById(transactionId)
                    .orElseThrow(() -> new RuntimeException("Transacción no encontrada: ID " + transactionId));

            Usuario usuario = usuariosRepository.findById(transaccion.getUsuario().getId())
                    .orElseThrow(() -> new RuntimeException("No se pudo encontrar usuario por ID de Transaccion"));

            if ("approved".equalsIgnoreCase(estado)) {
                LocalDateTime desde = usuario.getExpiracionSuscripcion() != null
                        && usuario.getExpiracionSuscripcion().isAfter(LocalDateTime.now())
                        ? usuario.getExpiracionSuscripcion()
                        : LocalDateTime.now();
                usuario.setExpiracionSuscripcion(desde.plusDays(30L));
                usuariosRepository.save(usuario);

                suscripcionMovimientoRepository.save(SuscripcionMovimiento.builder()
                        .usuario(usuario)
                        .dias(30)
                        .origen(OrigenMovimientoSuscripcion.PAGO_MP)
                        .admin(null)
                        .fechaExpiracionResultante(usuario.getExpiracionSuscripcion())
                        .creadoEn(LocalDateTime.now())
                        .build());

                EstadoUsuarioDTO estadoUsuarioDTO = EstadoUsuarioDTO.builder()
                    .userName(usuario.getNombreDeUsuario())
                    .licencia(true)
                    .vencimientoLicencia(usuario.getExpiracionSuscripcion().toString())
                    .build();
                notificacionService.notificarFechaSuscripcionAUsuario(usuario.getNombreDeUsuario(), estadoUsuarioDTO);
            }
        } catch (Exception e) {
            log.error("Error al procesar webhook: {}", e.getMessage(), e);
        }
    }

}