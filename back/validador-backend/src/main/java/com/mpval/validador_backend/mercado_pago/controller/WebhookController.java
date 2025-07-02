package com.mpval.validador_backend.mercado_pago.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.mpval.validador_backend.mercado_pago.dto.WebhookDTO;
import com.mpval.validador_backend.mercado_pago.service.MercadoPagoService;

@RestController
public class WebhookController {
    private final MercadoPagoService mercadoPagoService;

    public WebhookController(MercadoPagoService m){
        this.mercadoPagoService = m;
    }
    
    @PostMapping("/webhook")
    public ResponseEntity<String> recibirWebhook(@RequestBody WebhookDTO webhook) {
        try {
            mercadoPagoService.procesarWebhook(webhook);
            return ResponseEntity.ok("Webhook procesado");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error procesando webhook: " + e.getMessage());
        }
    }
}
