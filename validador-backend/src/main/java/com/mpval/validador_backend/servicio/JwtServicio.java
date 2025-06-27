package com.mpval.validador_backend.servicio;

import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.mpval.validador_backend.entidad.Usuario;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtServicio {
    @Value("${secret-key}")
    public String secretKey;

    @Value("${expiration}")
    private long jwtExpiration;

    @Value("${token.expiration}")
    private long refreshExpiration;

    public String extractUsername(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSignInKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();
        } catch (io.jsonwebtoken.security.SignatureException ex) {
            throw new RuntimeException("Token con firma inválida", ex);
        } catch (Exception ex) {
            throw new RuntimeException("Error al parsear token", ex);
        }
    }

    public String generateToken(final Usuario user) {
        return buildToken(user, jwtExpiration);
    }

    public String generateRefreshToken(final Usuario user) {
        return buildToken(user, refreshExpiration);
    }

    private String buildToken(final Usuario user, final long expiration) {
        System.out.println("Tiempo expiracion: " + expiration);
        return Jwts
                .builder()
                .claims(Map.of("name", user.getNombre()))
                .subject(user.getNombreDeUsuario())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isTokenValid(String token, Usuario user) {
        final String username = extractUsername(token);
        return (username.equals(user.getNombreDeUsuario())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
    }

    private SecretKey getSignInKey() {
        final byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}