package com.mpval.validador_backend.Usuario.service;

import org.springframework.stereotype.Service;

import com.mpval.validador_backend.Usuario.repository.UsuarioRepository;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepositorio;

    public UsuarioService(UsuarioRepository ur){
        this.usuarioRepositorio = ur;
    }
}
