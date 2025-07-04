package com.mpval.validador_backend.configuracion.websocket;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

public class WebSocketPrincipalHandler extends DefaultHandshakeHandler {

    @Override
    protected Principal determineUser(ServerHttpRequest request,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {
        String username = (String) attributes.get("username");
        return () -> username; // crea un Principal simple con el nombre de usuario
    }
}