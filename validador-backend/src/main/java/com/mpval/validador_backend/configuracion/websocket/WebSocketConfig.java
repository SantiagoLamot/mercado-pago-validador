package com.mpval.validador_backend.configuracion.websocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.mpval.validador_backend.Usuario.repository.UsuarioRepository;
import com.mpval.validador_backend.jwt.service.JwtService;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public WebSocketConfig(JwtService jwtService, UsuarioRepository usuarioRepository) {
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setHandshakeHandler(webSocketPrincipalHandler())
                .addInterceptors(jwtHandshakeInterceptor()) // ← usa el bean, no lo instancies a mano
                .setAllowedOriginPatterns("*");
                // .withSockJS();
    }

    @Bean
    public JwtHandshakeInterceptor jwtHandshakeInterceptor() {
        return new JwtHandshakeInterceptor(jwtService, usuarioRepository);
    }

    @Bean
    public WebSocketPrincipalHandler webSocketPrincipalHandler() {
        return new WebSocketPrincipalHandler();
    }
}