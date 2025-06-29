package com.mpval.validador_backend.mercado_pago.service;

import org.springframework.stereotype.Service;

import com.mpval.validador_backend.mercado_pago.entity.StateOauth;
import com.mpval.validador_backend.mercado_pago.repository.StateOauthRepository;

@Service
public class StateOauthService {
    private final StateOauthRepository stateOauthRepository;

    public StateOauthService(StateOauthRepository stateOauthRepository) {
        this.stateOauthRepository = stateOauthRepository;
    }

    public void guardarStateOauth(Long idUsuarioLogueado, String state) {
        StateOauth entity = new StateOauth(idUsuarioLogueado, state);
        stateOauthRepository.save(entity);
    }

    public Long obtenerIdUsuarioPorState(String state) {
        return stateOauthRepository.findByState(state)
                .orElseThrow(() -> new RuntimeException("state no encontrado"))
                .getUsuarioId();
    }
}
