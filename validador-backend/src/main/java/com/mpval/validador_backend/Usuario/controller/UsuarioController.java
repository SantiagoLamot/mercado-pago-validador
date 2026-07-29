package com.mpval.validador_backend.Usuario.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.mpval.validador_backend.Usuario.entity.Usuario;
import com.mpval.validador_backend.Usuario.repository.UsuarioRepository;
import com.mpval.validador_backend.jwt.dto.CambiarContrasenaRequestDTO;
import com.mpval.validador_backend.jwt.service.JwtService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Endpoints del usuario logueado sobre su propia cuenta (funciona para
 * cualquier rol: ADMIN o EMPRESA). Requiere estar autenticado - a diferencia
 * de /auth/**, esta ruta SI pasa por el filtro JWT.
 */
@RestController
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PatchMapping("/usuario/password")
    public ResponseEntity<?> cambiarContrasena(@Valid @RequestBody CambiarContrasenaRequestDTO request) {
        String nombreDeUsuario = jwtService.obtenerNombreDeUsuarioAutenticado();
        Usuario usuario = usuarioRepository.findByNombreDeUsuario(nombreDeUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches(request.getContrasenaActual(), usuario.getContrasena())) {
            return ResponseEntity.badRequest().body("La contraseña actual no es correcta");
        }

        usuario.setContrasena(passwordEncoder.encode(request.getContrasenaNueva()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok().build();
    }
}
