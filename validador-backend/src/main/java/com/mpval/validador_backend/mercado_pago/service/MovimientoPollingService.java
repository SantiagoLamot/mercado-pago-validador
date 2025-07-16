package com.mpval.validador_backend.mercado_pago.service;

import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.mpval.validador_backend.mercado_pago.dto.MovimientoResponse;
import com.mpval.validador_backend.mercado_pago.entity.Movimiento;
import com.mpval.validador_backend.mercado_pago.entity.OauthToken;
import com.mpval.validador_backend.mercado_pago.repository.OauthTokenRepository;

@Service
public class MovimientoPollingService {
    
    private final RestTemplate restTemplate;

    public MovimientoPollingService(RestTemplate r){
        this.restTemplate = r;
        this.oauthTokenRepository = repo;
    }

    public void verificarMovimientos() {
        for (OauthToken token : tokens) {
            String userId = token.getUsuario().getId().toString();
            Long lastId = token.getLastMovementId();
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(accessToken);
                HttpEntity<Void> entity = new HttpEntity<>(headers);

                ResponseEntity<MovimientoResponse> response = restTemplate.exchange(
                        "https://api.mercadopago.com/v1/account/movements?limit=1",
                        HttpMethod.GET,
                        entity,
                        MovimientoResponse.class);

                MovimientoResponse body = response.getBody();

                if (body != null && body.getResults() != null && !body.getResults().isEmpty()) {
                    Movimiento movimiento = body.getResults().get(0);

                    if ("credit".equals(movimiento.getType()) &&
                            "available".equals(movimiento.getStatus()) &&
                            (lastId == null || movimiento.getId() > lastId)) {

                        System.out.printf("[NOTIFICACIÓN] Usuario %s recibió $%.2f - %s\n",
                                userId, movimiento.getAmount(), movimiento.getDetail());

                    }
                }
            } catch (Exception e) {
                System.err.println("Error verificando movimientos de usuario " + userId + ": " + e.getMessage());
            }
        }
    }
}