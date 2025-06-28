package com.mpval.validador_backend.mercado_pago.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.mpval.validador_backend.mercado_pago.dto.OauthTokenRequestDTO;
import com.mpval.validador_backend.mercado_pago.entity.OauthToken;
import com.mpval.validador_backend.mercado_pago.repository.OauthTokenRepository;
import com.mpval.validador_backend.mercado_pago.util.EncriptadoUtil;
import com.mpval.validador_backend.usuario.entity.Usuario;
import com.mpval.validador_backend.usuario.service.UsuarioService;

@Service
public class OauthTokenService {

    @Value("${clientId}")
    String clientId;

    @Value("${redirectUrl}")
    String redirectUrl;

    @Value("${clientSecret}")
    String clientSecret;

    private final UsuarioService usuariosService;
    private final OauthTokenRepository oauthRepository;
    private final StateOauthService stateOauthService;
    private final EncriptadoUtil encriptadoUtil;

    public OauthTokenService(UsuarioService usuariosService, OauthTokenRepository oauthRepository,
            StateOauthService stateOauthService, EncriptadoUtil encriptadoUtil) {
        this.usuariosService = usuariosService;
        this.oauthRepository = oauthRepository;
        this.stateOauthService = stateOauthService;
        this.encriptadoUtil = encriptadoUtil;
    }

    public String UrlAutorizacion() {
        Long idUsuarioLogueado = usuariosService.obtenerUsuariosPorId(1L)// ACA OBTENER EL ID DEL USUARIO LOGUEADO
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
                .getId();
        String state = UUID.randomUUID().toString();
        stateOauthService.guardarStateOauth(idUsuarioLogueado, state);
        return "https://auth.mercadopago.com.ar/authorization?response_type=code" +
                "&client_id=" + clientId +
                "&redirect_uri=" + redirectUrl +
                "&state=" + state;
    }

    public void obtenerAccessToken(String code, String state) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "authorization_code");
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);
            body.add("code", code);
            body.add("redirect_uri", redirectUrl);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<OauthTokenRequestDTO> response = restTemplate.postForEntity(
                    "https://api.mercadopago.com/oauth/token",
                    request,
                    OauthTokenRequestDTO.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                throw new RuntimeException("Error al obtener el token de Mercado Pago");
            }

            guardarTokenNuevo(response.getBody(), usuariosService.obtenerUsuarioPorState(state));

        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Error de cliente: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener token: " + e.getMessage());
        }
    }

    public void actualizarToken(OauthTokenRequestDTO oauthTokenDTO, Usuario usuario) {
        OauthToken token = oauthRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new RuntimeException("Error al obtener token para guardar nuevo"));
        token.setAccessToken(encriptadoUtil.encriptar(oauthTokenDTO.getAccessToken()));
        token.setRefreshToken(encriptadoUtil.encriptar(oauthTokenDTO.getRefreshToken()));
        token.setPublicKey(encriptadoUtil.encriptar(oauthTokenDTO.getPublicKey()));
        token.setUserId(oauthTokenDTO.getUserId());
        token.setLiveMode(oauthTokenDTO.isLiveMode());
        token.setExpiresAt(LocalDateTime.now().plusSeconds(oauthTokenDTO.getExpiresIn()));
        token.setUsuario(usuario);

        oauthRepository.save(token);
    }

    public void guardarTokenNuevo(OauthTokenRequestDTO oauthTokenDTO, Usuario usuario) {
        OauthToken token = new OauthToken();
        token.setAccessToken(encriptadoUtil.encriptar(oauthTokenDTO.getAccessToken()));
        token.setRefreshToken(encriptadoUtil.encriptar(oauthTokenDTO.getRefreshToken()));
        token.setPublicKey(encriptadoUtil.encriptar(oauthTokenDTO.getPublicKey()));
        token.setUserId(oauthTokenDTO.getUserId());
        token.setLiveMode(oauthTokenDTO.isLiveMode());
        token.setExpiresAt(LocalDateTime.now().plusSeconds(oauthTokenDTO.getExpiresIn()));
        token.setUsuario(usuario);

        oauthRepository.save(token);
    }

    public String obtenerAccessTokenPorId(Long id) {
        return oauthRepository.findByUsuarioId(id)
                .orElseThrow(() -> new RuntimeException("no se encontro access token"))
                .getAccessToken();
    }

    public boolean AccessTokenValido(String accessToken) {
        String url = "https://api.mercadopago.com/users/me";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED || e.getStatusCode() == HttpStatus.FORBIDDEN) {
                return false;
            }
            return false;
        }
    }

    public List<OauthToken> obtenerTokenDeUsuariosVendedores() {
        return oauthRepository.findByUsuario_VendedorTrue();
    }
}
