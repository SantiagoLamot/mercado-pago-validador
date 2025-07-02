package com.mpval.validador_backend.mercado_pago.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mpval.validador_backend.mercado_pago.service.OauthTokenService;



@RestController
@RequestMapping("/oauth")
public class OauthTokenController {
    OauthTokenService oauthTokenService;

    public OauthTokenController(OauthTokenService o){
        this.oauthTokenService = o;
    }

}
