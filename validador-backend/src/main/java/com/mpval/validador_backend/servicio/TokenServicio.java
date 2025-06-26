package com.mpval.validador_backend.servicio;

import org.springframework.stereotype.Service;

import com.mpval.validador_backend.repositorio.TokenRepositorio;

@Service
public class TokenServicio {
    private final TokenRepositorio tokenRepositorio;
    
    public TokenServicio(TokenRepositorio tr){
        this.tokenRepositorio = tr;
    }
}
