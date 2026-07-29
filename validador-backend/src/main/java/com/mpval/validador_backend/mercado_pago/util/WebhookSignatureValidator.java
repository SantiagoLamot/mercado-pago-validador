package com.mpval.validador_backend.mercado_pago.util;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Map;
import java.util.stream.Collectors;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Valida el header x-signature que Mercado Pago envia en cada webhook.
 * Algoritmo oficial: HMAC-SHA256 sobre "id:{data.id};request-id:{x-request-id};ts:{ts};"
 * usando la clave secreta configurada en el panel de la app (MP_WEBHOOK_SECRET).
 */
@Component
public class WebhookSignatureValidator {

    @Value("${mercadopago.webhook-secret:}")
    private String webhookSecret;

    public boolean esValida(String xSignature, String xRequestId, String dataId) {
        if (webhookSecret == null || webhookSecret.isBlank()) {
            return false;
        }
        if (xSignature == null || xSignature.isBlank() || dataId == null) {
            return false;
        }

        Map<String, String> partes = parsear(xSignature);
        String ts = partes.get("ts");
        String v1 = partes.get("v1");
        if (ts == null || v1 == null) {
            return false;
        }

        String manifest = "id:" + dataId.toLowerCase() + ";" +
                (xRequestId != null ? "request-id:" + xRequestId + ";" : "") +
                "ts:" + ts + ";";

        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(manifest.getBytes(StandardCharsets.UTF_8));
            String calculado = HexFormat.of().formatHex(hash);
            return calculado.equalsIgnoreCase(v1);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            return false;
        }
    }

    private Map<String, String> parsear(String xSignature) {
        return java.util.Arrays.stream(xSignature.split(","))
                .map(String::trim)
                .filter(p -> p.contains("="))
                .collect(Collectors.toMap(
                        p -> p.substring(0, p.indexOf('=')).trim(),
                        p -> p.substring(p.indexOf('=') + 1).trim(),
                        (a, b) -> a));
    }
}
