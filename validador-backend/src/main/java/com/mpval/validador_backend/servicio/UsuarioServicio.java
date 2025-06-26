package com.mpval.validador_backend.servicio;

import org.springframework.stereotype.Service;

import com.mpval.validador_backend.repositorio.UsuarioRepositorio;

@Service
public class UsuarioServicio {
    private final UsuarioRepositorio usuarioRepositorio;

    public UsuarioServicio(UsuarioRepositorio ur){
        this.usuarioRepositorio = ur;
    }
}
