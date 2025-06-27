package com.mpval.validador_backend.Mercado_Pago.service;

import com.mpval.validador_backend.Mercado_Pago.repository.OauthTokenReposity;

public class OauthTokenService {
    private final OauthTokenReposity oauthTokenRepositorio;

    public OauthTokenService(OauthTokenReposity or){
        this.oauthTokenRepositorio = or;
    }
}
