package com.mpval.validador_backend.jwt.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mpval.validador_backend.Usuario.entity.Usuario;
import com.mpval.validador_backend.Usuario.repository.UsuarioRepository;
import com.mpval.validador_backend.jwt.dto.AuthRequestDTO;
import com.mpval.validador_backend.jwt.dto.TokenResponse;
import com.mpval.validador_backend.jwt.dto.UsuarioRequestDTO;
import com.mpval.validador_backend.jwt.entity.Token;
import com.mpval.validador_backend.jwt.repository.TokenRepository;
import com.mpval.validador_backend.mercado_pago.service.OauthTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository usuarioRepositorio;
    private final TokenRepository tokenRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtServicio;
    private final AuthenticationManager authenticationManager;
    private final OauthTokenService oauthTokenService;

    public TokenResponse register(final UsuarioRequestDTO request) {
        final Usuario user = Usuario.builder()
                .nombreDeUsuario(request.getNombreDeUsuario())
                .correo(request.getCorreo())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .nombreEmpresa(request.getEmpresa())
                .build();
        final Usuario savedUser = usuarioRepositorio.save(user);
        final String jwtToken = jwtServicio.generateToken(savedUser);
        final String refreshToken = jwtServicio.generateRefreshToken(savedUser);
        saveUserToken(savedUser, jwtToken);
    }

    public TokenResponse authenticate(final AuthRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getNombreDeUsuario(),
        final Usuario user = usuarioRepositorio.findByNombreDeUsuario(request.getNombreDeUsuario())
                .orElseThrow();
        final String accessToken = jwtServicio.generateToken(user);
        final String refreshToken = jwtServicio.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);
    }

    private void saveUserToken(Usuario user, String jwtToken) {
        final Token token = Token.builder()
                .usuario(user)
                .token(jwtToken)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepositorio.save(token);
    }

    private void revokeAllUserTokens(final Usuario user) {
        if (!validUserTokens.isEmpty()) {
            validUserTokens.forEach(token -> {
                token.setExpired(true);
                token.setRevoked(true);
            });
            tokenRepositorio.saveAll(validUserTokens);
        }
    }

    public TokenResponse refreshToken(@NotNull final String authentication) {
        if (authentication == null || !authentication.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid auth header");
        }
        final String refreshToken = authentication.substring(7);
        final String userName = jwtServicio.extractUsername(refreshToken);
        if (userName == null) {
            return null;
        }
        final Usuario user = this.usuarioRepositorio.findByNombreDeUsuario(userName).orElseThrow();
        final boolean isTokenValid = jwtServicio.isTokenValid(refreshToken, user);
        if (!isTokenValid) {
            return null;
        }
        final String accessToken = jwtServicio.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);

    private Map<String, Object> getEstadoUsuario(Usuario user) {
        Map<String, Object> estado = new HashMap<>();

        boolean oauth = oauthTokenService.AccessTokenValido(user);
        boolean licencia = user.getExpiracionSuscripcion() != null &&
                user.getExpiracionSuscripcion().isAfter(LocalDateTime.now());
        String fechaExpiracion = user.getExpiracionSuscripcion() != null
                ? user.getExpiracionSuscripcion().toString()
                : null;

        estado.put("oauth", oauth);
        estado.put("licencia", licencia);
        estado.put("fechaExpiracion", fechaExpiracion);

        return estado;
    }
}
