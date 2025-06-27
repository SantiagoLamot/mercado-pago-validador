package com.mpval.validador_backend.Mercado_Pago.service;

import org.springframework.stereotype.Service;

import com.mpval.validador_backend.Mercado_Pago.repository.StateOauthRepository;

@Service
public class StateOauthService {
    private final StateOauthRepository stateOauthRepositorio;

    public StateOauthService(StateOauthRepository sr){
        this.stateOauthRepositorio = sr;
    }
}
