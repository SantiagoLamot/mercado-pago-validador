package com.mpval.validador_backend.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.entidad.Token;

public interface TokenRepositorio extends JpaRepository<Token, Long>{
}
