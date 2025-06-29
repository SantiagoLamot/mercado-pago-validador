package com.mpval.validador_backend.webSocket.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.mpval.validador_backend.webSocket.dto.PagoNotificacionDTO;

import lombok.Data;

@Controller
public class ChatController {
    @MessageMapping("/app/chat")
    @SendToUser("/queue/mensajes")
    public PagoNotificacionDTO manejarMensaje(Mensaje mensaje, Principal principal) {
        return PagoNotificacionDTO.builder()
                .mensaje("Pago exitoso")
                .monto(123.45)
                .nombreComprador(principal.getName()) // quien está logueado
                .build();
    }

    @Data
    public static class Mensaje {
        private String texto;
        private String fecha;
    }
}