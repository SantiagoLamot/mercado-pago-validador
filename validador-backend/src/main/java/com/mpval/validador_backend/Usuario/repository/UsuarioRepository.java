package com.mpval.validador_backend.Usuario.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.Usuario.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>{

    Optional<Usuario> findByNombreDeUsuario(String nombreDeUsuario);
}
