package com.mpval.validador_backend.mercado_pago.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mpval.validador_backend.mercado_pago.service.MercadoPagoService;


@RestController
public class PagoSuscripcion {
    private final MercadoPagoService mercadoPagoService;

    public PagoSuscripcion(MercadoPagoService m){
        this.mercadoPagoService = m;
    }

    @GetMapping("/pago/suscripcion")
    public String iniciarPagoSuscripcion(@RequestParam String param) {
        return new String();
    }
    
}
