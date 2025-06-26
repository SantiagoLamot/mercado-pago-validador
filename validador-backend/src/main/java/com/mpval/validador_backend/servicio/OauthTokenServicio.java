package com.mpval.validador_backend.servicio;

import com.mpval.validador_backend.repositorio.OauthTokenRepositorio;

public class OauthTokenServicio {
    private final OauthTokenRepositorio oauthTokenRepositorio;

    public OauthTokenServicio(OauthTokenRepositorio or){
        this.oauthTokenRepositorio = or;
    }
}
