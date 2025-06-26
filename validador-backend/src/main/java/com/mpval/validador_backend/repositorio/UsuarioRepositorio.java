package com.mpval.validador_backend.repositorio;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.entidad.Usuario;

public interface UsuarioRepositorio extends JpaRepository<Usuario, Long>{
}
