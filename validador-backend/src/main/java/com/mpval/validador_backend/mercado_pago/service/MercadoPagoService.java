package com.mpval.validador_backend.mercado_pago.service;

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

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import com.mpval.validador_backend.mercado_pago.dto.OauthTokenRequestDTO;
import com.mpval.validador_backend.mercado_pago.dto.WebhookDTO;
import com.mpval.validador_backend.mercado_pago.entity.OauthToken;
import com.mpval.validador_backend.mercado_pago.repository.OauthTokenRepository;
import com.mpval.validador_backend.usuario.entity.Usuario;
import com.mpval.validador_backend.usuario.repository.UsuarioRepository;
import com.mpval.validador_backend.webSocket.dto.PagoNotificacionDTO;
import com.mpval.validador_backend.webSocket.service.NotificacionService;

@Service
public class MercadoPagoService {

    // @Value("${mercadopago.access-token}")
    // String accessToken;
    @Value("${clientId}")
    String clientId;

    @Value("${clientSecret}")
    String clientSecret;

    private final UsuarioRepository usuariosRepository;
    private final OauthTokenRepository oauthRepository;
    private final NotificacionService notificacionService;

    public MercadoPagoService(UsuarioRepository u, OauthTokenRepository oa, NotificacionService n) {
        this.usuariosRepository = u;
        this.oauthRepository = oa;
        this.notificacionService = n;
    }

    public void procesarWebhook(WebhookDTO webhook) {
        if (!"payment".equalsIgnoreCase(webhook.getType())) {
            System.out.println("Webhook ignorado: tipo no soportado " + webhook.getType());
            return;
        }

        try {
            // Obtengo el ID de pago
            String paymentId = webhook.getData().getId();

            // Con el id obtenido busco el pago
            PaymentClient client = new PaymentClient();
            Payment payment = client.get(Long.parseLong(paymentId));

            // Obtengo el estado de la transaccion
            String estado = payment.getStatus();

            // Se obtiene el id del usuario de la app mediante el id de mp
            Long idMp = webhook.getUser_id();
            OauthToken oauthToken = oauthRepository.findByUserId(idMp)
                    .orElseThrow(() -> new RuntimeException("Error al obtener id del usuario de MP"));
            Usuario usuario = usuariosRepository.getById(oauthToken.getUsuario().getId());
            // Se verifica que se encontro el id del usuario en la Transaccion
            if (usuario == null) {
                System.out.println("No se encontró externalReference (transactionId)");
                return;
            }

            // se setean los estados en caso que pase las validaciones
            if ("approved".equalsIgnoreCase(estado)) {
                // Crear DTO de notificación con datos del pago
                PagoNotificacionDTO dto = PagoNotificacionDTO.builder()
                    .mensaje("Recibiste un nuevo pago")
                    .monto(payment.getTransactionAmount().doubleValue())
                    .nombreComprador(payment.getPayer().getFirstName() + " " + payment.getPayer().getLastName())
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