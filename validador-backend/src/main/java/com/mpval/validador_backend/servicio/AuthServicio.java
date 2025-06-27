package com.mpval.validador_backend.servicio;

import java.util.List;

import org.antlr.v4.runtime.misc.NotNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.mpval.validador_backend.dto.AuthRequestDTO;
import com.mpval.validador_backend.dto.TokenResponse;
import com.mpval.validador_backend.dto.UsuarioRequestDTO;
import com.mpval.validador_backend.entidad.Token;
import com.mpval.validador_backend.entidad.Usuario;
import com.mpval.validador_backend.repositorio.TokenRepositorio;
import com.mpval.validador_backend.repositorio.UsuarioRepositorio;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServicio {
    private final UsuarioRepositorio usuarioRepositorio;
    private final TokenRepositorio tokenRepositorio;
    private final PasswordEncoder passwordEncoder;
    private final JwtServicio jwtServicio;
    private final AuthenticationManager authenticationManager;
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
        return new TokenResponse(jwtToken, refreshToken);
    }
    public TokenResponse authenticate(final AuthRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getNombreDeUsuario(),
                        request.getContrasena()
                )
        );
        final Usuario user = usuarioRepositorio.findByNombreDeUsuario(request.getNombreDeUsuario())
                .orElseThrow();
        final String accessToken = jwtServicio.generateToken(user);
        final String refreshToken = jwtServicio.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);
        return new TokenResponse(accessToken, refreshToken);
    }

    private void saveUserToken(Usuario user, String jwtToken) {
        final Token token = Token.builder()
                .usuario(user)
                .token(jwtToken)
                .tokenType(Token.Token_Type.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepositorio.save(token);
    }

    private void revokeAllUserTokens(final Usuario user) {
        final List<Token> validUserTokens = tokenRepositorio.findByUsuarioIdAndExpiredFalseAndRevokedFalse(user.getId());
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
        return new TokenResponse(accessToken, refreshToken);
    }
}
