package com.mpval.validador_backend.webSocket.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    @MessageMapping("/app/chat")
    @SendToUser("/queue/mensajes")
    public String manejarMensaje(Principal principal) {
        return "Se recibio mensaje del frontend en el backend";
    }
}