package com.mpval.validador_backend.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.entidad.OauthToken;

public interface OauthTokenRepositorio extends JpaRepository<OauthToken, Long>{
}
