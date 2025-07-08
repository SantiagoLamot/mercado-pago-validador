package com.mpval.validador_backend.mercado_pago.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MovimientoPollingService {
    
    private final RestTemplate restTemplate;

    public MovimientoPollingService(RestTemplate r){
        this.restTemplate = r;
    }
}
