package com.mpval.validador_backend.Mercado_Pago.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.Mercado_Pago.entity.OauthToken;

public interface OauthTokenReposity extends JpaRepository<OauthToken, Long>{
}
