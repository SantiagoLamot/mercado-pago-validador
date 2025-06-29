package com.mpval.validador_backend.webSocket.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.mpval.validador_backend.webSocket.dto.PagoNotificacionDTO;

@Service
public class NotificacionService {

    private final SimpMessagingTemplate messagingTemplate;

    public NotificacionService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void notificarPagoAUsuario(String username, PagoNotificacionDTO dto) {
        messagingTemplate.convertAndSendToUser(
                username,// nombre del usuario autenticado (del JWT)
                "/queue/pagos",// destino STOMP que escucha el frontend
                dto
        );
    }
}