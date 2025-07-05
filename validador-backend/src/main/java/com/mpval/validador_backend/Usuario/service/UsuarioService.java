package com.mpval.validador_backend.Usuario.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mpval.validador_backend.Usuario.entity.Usuario;
import com.mpval.validador_backend.Usuario.repository.UsuarioRepository;
import com.mpval.validador_backend.mercado_pago.service.StateOauthService;

@Service
public class UsuarioService {
    
    private final UsuarioRepository usuariosRepository;
    private final StateOauthService stateOauthService;
    
    public UsuarioService(UsuarioRepository usuariosRepository, StateOauthService stateOauthService){
        this.usuariosRepository=usuariosRepository;
        this.stateOauthService = stateOauthService;
    }

    public Optional<Usuario> obtenerUsuariosPorId(Long id){
        return usuariosRepository.findById(id);
    }

    public Usuario obtenerUsuarioPorState(String state){
        Long id = stateOauthService.obtenerIdUsuarioPorState(state);
        return usuariosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("usuario no encontrado"));
    }
    public Optional<Usuario> obtenerUsuarioPorNombreDeUsuario(String nombreDeUsuario){
        return usuariosRepository.findByNombreDeUsuario(nombreDeUsuario);
    }

}