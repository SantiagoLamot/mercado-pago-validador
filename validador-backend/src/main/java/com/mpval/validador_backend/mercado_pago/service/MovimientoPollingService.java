package com.mpval.validador_backend.mercado_pago.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Objects;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.mpval.validador_backend.Usuario.entity.Usuario;
import com.mpval.validador_backend.Usuario.repository.UsuarioRepository;
import com.mpval.validador_backend.jwt.entity.Token;
import com.mpval.validador_backend.jwt.repository.TokenRepository;
import com.mpval.validador_backend.mercado_pago.dto.MovimientoResponse;
import com.mpval.validador_backend.mercado_pago.entity.Movimiento;
import com.mpval.validador_backend.mercado_pago.entity.OauthToken;
import com.mpval.validador_backend.mercado_pago.repository.OauthTokenRepository;
import com.mpval.validador_backend.webSocket.dto.PagoNotificacionDTO;
import com.mpval.validador_backend.webSocket.service.NotificacionService;

@Service
public class MovimientoPollingService {

    private final RestTemplate restTemplate;
    private final OauthTokenRepository oauthTokenRepository;
    private final NotificacionService notificacionService;
    private final UsuarioRepository usuarioRepository;
    private final TokenRepository tokenRepository;

    public MovimientoPollingService(RestTemplate r, OauthTokenRepository repo, NotificacionService n,
            UsuarioRepository u, TokenRepository t) {
        this.restTemplate = r;
        this.oauthTokenRepository = repo;
        this.notificacionService = n;
        this.usuarioRepository = u;
        this.tokenRepository = t;
    }

    @Scheduled(fixedRate = 5000)
    public void verificarMovimientos() {
        System.out.println("<<<ENTRA A VERIFICAR MOVIMIENTOS>>>");
        List<Token> TokensValidos = tokenRepository.findByRevokedFalseAndExpiredFalse();

        LocalDateTime now = LocalDateTime.now();

        List<Usuario> usuariosConSuscripcionActiva = TokensValidos.stream()
                .map(Token::getUsuario)
                .filter(usuario -> usuario.getExpiracionSuscripcion() != null &&
                        usuario.getExpiracionSuscripcion().isAfter(now))
                .distinct()
                .collect(Collectors.toList());

        List<OauthToken> oauthTokens = usuariosConSuscripcionActiva.stream()
                .map(usuario -> oauthTokenRepository.findByUsuario(usuario))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        for (OauthToken token : oauthTokens) {
            Usuario usuario = usuarioRepository.findById(token.getUsuario().getId())
                    .orElseThrow(() -> new RuntimeException("Error al obtener usuario por OauthToken"));
            String accessToken = token.getAccessToken();
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

                        // Crear DTO de notificación con datos del pago
                        PagoNotificacionDTO dto = PagoNotificacionDTO.builder()
                                .mensaje("Recibiste un nuevo pago")
                                .monto(movimiento.getAmount().doubleValue())
                                .hora(LocalDateTime.now())
                                .build();
                        notificacionService.notificarPagoAUsuario(usuario.getNombreDeUsuario(), dto);
                        token.setLastMovementId(movimiento.getId());
                        oauthTokenRepository.save(token);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error verificando movimientos de usuario " + usuario.getNombreDeUsuario() + ": "
                        + e.getMessage());
            }
        }
    }

}