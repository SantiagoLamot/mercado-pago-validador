package com.mpval.validador_backend.mercado_pago.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.mercadopago.resources.preference.Preference;
import com.mpval.validador_backend.Usuario.entity.Usuario;
import com.mpval.validador_backend.Usuario.repository.UsuarioRepository;
import com.mpval.validador_backend.jwt.service.JwtService;
import com.mpval.validador_backend.mercado_pago.dto.EstadoUsuarioDTO;
import com.mpval.validador_backend.mercado_pago.dto.OauthTokenRequestDTO;
import com.mpval.validador_backend.mercado_pago.dto.WebhookDTO;
import com.mpval.validador_backend.mercado_pago.entity.Transaccion;
import com.mpval.validador_backend.mercado_pago.repository.TransaccionRepository;
import com.mpval.validador_backend.webSocket.service.NotificacionService;

@Service
public class MercadoPagoService {

    @Value("")
    String clientId;

    @Value("")
    String clientSecret;

    @Value("${mercadopago.access-token}")
    String accessToken;

    private final UsuarioRepository usuariosRepository;
    private final NotificacionService notificacionService;
    private final JwtService jwtService;
    private final TransaccionRepository transaccionRepository;
    public MercadoPagoService(UsuarioRepository u, NotificacionService n, JwtService j, TransaccionRepository t) {
        this.usuariosRepository = u;
        this.notificacionService = n;
        this.jwtService = j;
        this.transaccionRepository = t;
    }

    // ================ LINK PARA PAGAR SUSCRIP ================
    public String pagarSuscripcioninit() throws MPException, MPApiException{
        Transaccion nueva = new Transaccion();
        Usuario usuario = usuariosRepository.findByNombreDeUsuario(jwtService.obtenerNombreDeUsuarioAutenticado())
        .orElseThrow(()-> new RuntimeException("Error con usuario logueado"));
        
        nueva.setUsuario(usuario);
        Transaccion transaccion = transaccionRepository.save(nueva);
        
        MercadoPagoConfig.setAccessToken(accessToken);

        PreferenceItemRequest item = PreferenceItemRequest.builder()
            .title("30 dias de suscipcion a MP Validador")
            .quantity(1)
            .currencyId("ARG")
            .unitPrice(new BigDecimal(1L))
            .build();
        
        OffsetDateTime ahora = OffsetDateTime.now();
        OffsetDateTime expiracion = ahora.plusMinutes(2);

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
            .items(List.of(item))
            .externalReference(transaccion.getId().toString())
            .expires(true)
            .expirationDateFrom(ahora)
            .expirationDateTo(expiracion)
            .build();
        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);
        return preference.getInitPoint();
    }
    // ================ WEBHOOK ================
    public void procesarWebhook(WebhookDTO webhook) {
        if (!"payment".equalsIgnoreCase(webhook.getType())) {
            System.out.println("Webhook ignorado: tipo no soportado " + webhook.getType());
            return;
        }
        try {
            
            // Obtengo el ID de pago
            Long paymentId = webhook.getData().getId();

            // Con el id obtenido busco el pago
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(paymentId);

            if (payment == null) {
                throw new RuntimeException("el payment es nulo");
            }

            // Obtengo el estado de la transaccion
            String estado = payment.getStatus();

            Usuario usuario = usuariosRepository.getById(oauthToken.getUsuario().getId());
            // Se verifica que se encontro el id del usuario en la Transaccion
            if (usuario == null) {
                System.out.println("No se encontró el usuario vendedor en BD local");
                return;
            }

            // se setean los estados en caso que pase las validaciones
            if ("approved".equalsIgnoreCase(estado)) {
                // Crear DTO de notificación con datos del pago
                PagoNotificacionDTO dto = PagoNotificacionDTO.builder()
                        .mensaje("Recibiste un nuevo pago")
                        .monto(payment.getTransactionAmount().doubleValue())
                        .email(payment.getPayer().getEmail())
                        .hora(LocalDateTime.now())
                        .build();
                // Notificar al usuario logueado en WebSocket
                notificacionService.notificarPagoAUsuario(usuario.getNombreDeUsuario(), dto);
            }
        } catch (Exception e) {
            System.out.println("Error al procesar webhook: " + e.getMessage());
        }
    }

    public OauthTokenRequestDTO refrescarToken(String refreshToken) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            String url = "https://api.mercadopago.com/oauth/token";

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "refresh_token");
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);
            body.add("refresh_token", refreshToken);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<OauthTokenRequestDTO> response = restTemplate.postForEntity(url, request,
                    OauthTokenRequestDTO.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.BAD_REQUEST || e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new RuntimeException("El refresh token fue revocado o no es válido");
            }
            throw e;
        }
    }
}