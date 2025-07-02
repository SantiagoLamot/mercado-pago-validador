package com.mpval.validador_backend.mercado_pago.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.mercado_pago.entity.StateOauth;

public interface StateOauthRepository extends JpaRepository<StateOauth, Long> {
    Optional<StateOauth> findByState(String state);
}
