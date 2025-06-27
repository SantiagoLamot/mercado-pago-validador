package com.mpval.validador_backend.repositorio;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.entidad.Token;

public interface TokenRepositorio extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String jwt);

List<Token> findByUsuarioIdAndExpiredFalseAndRevokedFalse(Long id);
}
