package com.mpval.validador_backend.mercado_pago.util;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

/**
 * Token bucket simple para throttlear las requests salientes a la API de
 * Mercado Pago entre todas las cuentas conectadas (evita pegarle a la API
 * mas rapido de lo permitido cuando hay muchas empresas en el mismo ciclo).
 */
@Component
public class MercadoPagoRateLimiter {

    @Value("${polling.rate-limit-rps:4}")
    private int requestsPorSegundo;

    private Semaphore permisos;
    private ScheduledExecutorService reponedor;

    @PostConstruct
    public void iniciar() {
        permisos = new Semaphore(requestsPorSegundo);
        reponedor = Executors.newSingleThreadScheduledExecutor(r -> {
            Thread t = new Thread(r, "mp-rate-limiter");
            t.setDaemon(true);
            return t;
        });
        long periodoMs = Math.max(1000L / requestsPorSegundo, 50L);
        reponedor.scheduleAtFixedRate(() -> {
            permisos.drainPermits();
            permisos.release(requestsPorSegundo);
        }, periodoMs, periodoMs, TimeUnit.MILLISECONDS);
    }

    @PreDestroy
    public void detener() {
        if (reponedor != null) {
            reponedor.shutdownNow();
        }
    }

    public void acquire() {
        try {
            permisos.acquire();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
