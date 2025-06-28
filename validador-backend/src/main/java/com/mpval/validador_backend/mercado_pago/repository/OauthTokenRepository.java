package com.mpval.validador_backend.mercado_pago.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.mercado_pago.entity.OauthToken;

public interface OauthTokenRepository extends JpaRepository<OauthToken, Long> {
    Optional<OauthToken> findByUsuarioId(Long userId);
    List<OauthToken> findByUsuario_VendedorTrue();
}
