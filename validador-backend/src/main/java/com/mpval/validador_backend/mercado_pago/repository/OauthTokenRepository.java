package com.mpval.validador_backend.mercado_pago.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.Usuario.entity.Usuario;
import com.mpval.validador_backend.mercado_pago.entity.OauthToken;

public interface OauthTokenRepository extends JpaRepository<OauthToken, Long> {
    Optional<OauthToken> findByUsuarioId(Long userId);
    Optional <OauthToken> findByUserId(Long idMp);
    List <OauthToken> findByUsuario(Usuario usuario);
    List<OauthToken> findByAccessTokenIsNotNull();
}
