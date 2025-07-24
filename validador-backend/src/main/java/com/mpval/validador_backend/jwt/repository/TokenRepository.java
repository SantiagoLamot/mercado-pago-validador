package com.mpval.validador_backend.jwt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.jwt.entity.Token;

public interface TokenRepository extends JpaRepository<Token, Long> {
    Optional<Token> findByToken(String jwt);

List<Token> findByUsuarioIdAndExpiredFalseAndRevokedFalse(Long id);

List<Token> findByRevokedFalseAndExpiredFalse();
}

