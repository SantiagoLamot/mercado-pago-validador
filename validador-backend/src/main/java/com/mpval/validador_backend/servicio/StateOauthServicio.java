package com.mpval.validador_backend.servicio;

import org.springframework.stereotype.Service;

import com.mpval.validador_backend.repositorio.StateOauthRepositorio;

@Service
public class StateOauthServicio {
    private final StateOauthRepositorio stateOauthRepositorio;

    public StateOauthServicio(StateOauthRepositorio sr){
        this.stateOauthRepositorio = sr;
    }
}
