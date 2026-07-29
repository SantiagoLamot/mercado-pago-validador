package com.mpval.validador_backend.mercado_pago.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mpval.validador_backend.mercado_pago.dto.WebhookDTO;
import com.mpval.validador_backend.mercado_pago.service.MercadoPagoService;
import com.mpval.validador_backend.mercado_pago.util.WebhookSignatureValidator;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class WebhookController {

    private final MercadoPagoService mercadoPagoService;
    private final WebhookSignatureValidator webhookSignatureValidator;

    @PostMapping("/webhook")
    public ResponseEntity<String> recibirWebhook(
            @RequestBody WebhookDTO webhook,
            @RequestHeader(value = "x-signature", required = false) String xSignature,
            @RequestHeader(value = "x-request-id", required = false) String xRequestId,
            @RequestParam(value = "data.id", required = false) String dataId) {

        String id = dataId != null ? dataId
                : (webhook.getData() != null && webhook.getData().getId() != null
                        ? webhook.getData().getId().toString()
                        : null);

        if (!webhookSignatureValidator.esValida(xSignature, xRequestId, id)) {
            log.warn("Webhook recibido con firma invalida (tipo={}, id={})", webhook.getType(), id);
            return ResponseEntity.status(401).body("Firma invalida");
        }

        log.info("Webhook recibido: tipo={}, id={}, user_id={}", webhook.getType(), id, webhook.getUser_id());
        mercadoPagoService.procesarWebhookAsync(webhook);
        return ResponseEntity.ok("Webhook recibido");
    }
}
