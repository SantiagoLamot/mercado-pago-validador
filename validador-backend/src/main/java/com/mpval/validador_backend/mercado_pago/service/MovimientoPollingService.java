package com.mpval.validador_backend.mercado_pago.service;

import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.mpval.validador_backend.mercado_pago.dto.MovimientoResponse;
import com.mpval.validador_backend.mercado_pago.entity.Movimiento;
import com.mpval.validador_backend.mercado_pago.entity.OauthToken;
import com.mpval.validador_backend.mercado_pago.repository.OauthTokenRepository;

@Service
public class MovimientoPollingService {
    
    private final RestTemplate restTemplate;

    public MovimientoPollingService(RestTemplate r){
        this.restTemplate = r;
    }
}