package com.mpval.validador_backend.configuracion;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.mpval.validador_backend.Usuario.entity.Rol;
import com.mpval.validador_backend.Usuario.entity.Usuario;
import com.mpval.validador_backend.Usuario.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Crea el primer usuario ADMIN si todavia no existe ninguno, a partir de las
 * variables de entorno ADMIN_BOOTSTRAP_USERNAME/EMAIL/PASSWORD. Solo actua una
 * vez: si ya hay un admin en la base, no hace nada.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.bootstrap.username:}")
    private String bootstrapUsername;

    @Value("${admin.bootstrap.email:}")
    private String bootstrapEmail;

    @Value("${admin.bootstrap.password:}")
    private String bootstrapPassword;

    @Override
    public void run(String... args) {
        if (bootstrapUsername == null || bootstrapUsername.isBlank()
                || bootstrapEmail == null || bootstrapEmail.isBlank()
                || bootstrapPassword == null || bootstrapPassword.isBlank()) {
            return;
        }

        if (usuarioRepository.existsByRol(Rol.ADMIN)) {
            return;
        }

        Usuario admin = Usuario.builder()
                .nombreDeUsuario(bootstrapUsername)
                .correo(bootstrapEmail)
                .contrasena(passwordEncoder.encode(bootstrapPassword))
                .nombre("Admin")
                .apellido("General")
                .nombreEmpresa("MP Validador")
                .rol(Rol.ADMIN)
                .activo(true)
                .build();
        usuarioRepository.save(admin);
        log.info("Usuario ADMIN creado automaticamente: {}", bootstrapUsername);
    }
}
