package com.mpval.validador_backend.configuracion.websocket;

import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import com.mpval.validador_backend.jwt.service.JwtService;
import com.mpval.validador_backend.usuario.entity.Usuario;
import com.mpval.validador_backend.usuario.repository.UsuarioRepository;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public JwtHandshakeInterceptor(JwtService j, UsuarioRepository u) {
        this.jwtService = j;
        this.usuarioRepository = u;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
            WebSocketHandler wsHandler, Map<String, Object> attributes) {

        String uri = request.getURI().toString();
        
        String token = null;
        if (uri.contains("token=")) {
            token = uri.substring(uri.indexOf("token=") + 6);
            if (token.contains("&")) {
                token = token.substring(0, token.indexOf("&"));
            }
        }

        if (token != null) {
            try {
                String username = jwtService.extractUsername(token);
                
                Usuario usuario = usuarioRepository.findByNombreDeUsuario(username)
                        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                if (jwtService.isTokenValid(token, usuario)) {
                    attributes.put("username", username);
                    return true;
                }
            } catch (Exception e) {
                throw new RuntimeException("Error al validar token");
            }
        }
        return false;
    }
}