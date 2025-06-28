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
import com.mpval.validador_backend.mercado_pago.util.EncriptadoUtil;
import com.mpval.validador_backend.usuario.repository.UsuarioRepository;

@Service
public class MercadoPagoService {

    // @Value("${mercadopago.access-token}")
    // String accessToken;
    @Value("${clientId}")
    String clientId;

    @Value("${clientSecret}")
    String clientSecret;

    private final UsuarioRepository usuariosRepository;
    private final OauthTokenService oauthService;
    private final EncriptadoUtil encriptadoUtil;

    public MercadoPagoService(UsuarioRepository u,OauthTokenService o, EncriptadoUtil e) {
        this.usuariosRepository = u;
        this.oauthService = o;
        this.encriptadoUtil = e;
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

            // Faalta obtener el Id del usuario de mercado pago para relacionarlo al usuario de la app
            Long id = 1L;
            // Se verifica que se encontro el id del usuario en la Transaccion
            if (id == null) {
                System.out.println("No se encontró externalReference (transactionId)");
                return;
            }
            
            // se setean los estados en caso que pase las validaciones
            if ("approved".equalsIgnoreCase(estado)) {
                //FALTA LOGICA PARA ENVIAR EL WEBSOCKET
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

            ResponseEntity<OauthTokenRequestDTO> response = restTemplate.postForEntity(url, request, OauthTokenRequestDTO.class);

            return response.getBody();
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.BAD_REQUEST || e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                throw new RuntimeException("El refresh token fue revocado o no es válido");
            }
            throw e;
        }
    }
}