package com.mpval.validador_backend.mercado_pago.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class PagoSuscripcion {
    @GetMapping("/pago/suscripcion")
    public String iniciarPagoSuscripcion(@RequestParam String param) {
        return new String();
    }
    
}
