package com.mpval.validador_backend.admin.controller;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mpval.validador_backend.Usuario.entity.Rol;
import com.mpval.validador_backend.Usuario.entity.Usuario;
import com.mpval.validador_backend.Usuario.repository.UsuarioRepository;
import com.mpval.validador_backend.admin.dto.AjusteSuscripcionRequestDTO;
import com.mpval.validador_backend.admin.dto.AltaEmpresaRequestDTO;
import com.mpval.validador_backend.admin.dto.AltaEmpresaResponseDTO;
import com.mpval.validador_backend.admin.dto.ConfiguracionSuscripcionRequestDTO;
import com.mpval.validador_backend.admin.dto.EmpresaResumenDTO;
import com.mpval.validador_backend.admin.dto.EstadoEmpresaRequestDTO;
import com.mpval.validador_backend.admin.dto.SuscripcionMovimientoDTO;
import com.mpval.validador_backend.admin.entity.OrigenMovimientoSuscripcion;
import com.mpval.validador_backend.admin.entity.SuscripcionMovimiento;
import com.mpval.validador_backend.admin.repository.SuscripcionMovimientoRepository;
import com.mpval.validador_backend.jwt.service.JwtService;
import com.mpval.validador_backend.mercado_pago.entity.ConfiguracionSuscripcion;
import com.mpval.validador_backend.mercado_pago.entity.OauthToken;
import com.mpval.validador_backend.mercado_pago.repository.ConfiguracionSuscripcionRepository;
import com.mpval.validador_backend.mercado_pago.repository.OauthTokenRepository;

import lombok.RequiredArgsConstructor;

/**
 * Panel del admin general: alta de empresas, ajuste manual de suscripciones,
 * y configuracion del precio mensual. Todo protegido por rol ADMIN.
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UsuarioRepository usuarioRepository;
    private final OauthTokenRepository oauthTokenRepository;
    private final ConfiguracionSuscripcionRepository configuracionSuscripcionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SuscripcionMovimientoRepository suscripcionMovimientoRepository;

    @GetMapping("/empresas")
    public ResponseEntity<List<EmpresaResumenDTO>> listarEmpresas() {
        List<Usuario> empresas = usuarioRepository.findByRol(Rol.EMPRESA);
        List<EmpresaResumenDTO> resumen = empresas.stream().map(this::aResumen).toList();
        return ResponseEntity.ok(resumen);
    }

    @PostMapping("/empresas")
    public ResponseEntity<AltaEmpresaResponseDTO> altaEmpresa(@RequestBody AltaEmpresaRequestDTO request) {
        String contrasenaTemporal = generarContrasenaTemporal();

        Usuario nueva = Usuario.builder()
                .nombreDeUsuario(request.getNombreDeUsuario())
                .correo(request.getCorreo())
                .contrasena(passwordEncoder.encode(contrasenaTemporal))
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .nombreEmpresa(request.getNombreEmpresa())
                .rol(Rol.EMPRESA)
                .activo(true)
                .build();
        Usuario guardada = usuarioRepository.save(nueva);

        AltaEmpresaResponseDTO response = AltaEmpresaResponseDTO.builder()
                .id(guardada.getId())
                .nombreDeUsuario(guardada.getNombreDeUsuario())
                .contrasenaTemporal(contrasenaTemporal)
                .build();
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/empresas/{id}/suscripcion")
    public ResponseEntity<EmpresaResumenDTO> ajustarSuscripcion(@PathVariable Long id,
            @RequestBody AjusteSuscripcionRequestDTO request) {
        Usuario empresa = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        Integer diasAplicados = null;

        if (request.getFechaExpiracion() != null && !request.getFechaExpiracion().isBlank()) {
            empresa.setExpiracionSuscripcion(LocalDateTime.parse(request.getFechaExpiracion(),
                    DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        } else if (request.getDias() != null) {
            diasAplicados = request.getDias();
            LocalDateTime base;
            if (diasAplicados < 0) {
                // Quitar dias: se resta sobre la fecha real guardada (aunque ya haya vencido).
                base = empresa.getExpiracionSuscripcion() != null ? empresa.getExpiracionSuscripcion() : LocalDateTime.now();
            } else {
                // Sumar dias: si ya vencio, se suma desde hoy en vez de arrastrar la fecha vieja.
                base = empresa.getExpiracionSuscripcion() != null
                        && empresa.getExpiracionSuscripcion().isAfter(LocalDateTime.now())
                        ? empresa.getExpiracionSuscripcion()
                        : LocalDateTime.now();
            }
            empresa.setExpiracionSuscripcion(base.plusDays(diasAplicados));
        }

        usuarioRepository.save(empresa);

        Usuario admin = usuarioRepository.findByNombreDeUsuario(jwtService.obtenerNombreDeUsuarioAutenticado())
                .orElse(null);
        suscripcionMovimientoRepository.save(SuscripcionMovimiento.builder()
                .usuario(empresa)
                .dias(diasAplicados)
                .origen(OrigenMovimientoSuscripcion.MANUAL_ADMIN)
                .admin(admin)
                .fechaExpiracionResultante(empresa.getExpiracionSuscripcion())
                .creadoEn(LocalDateTime.now())
                .build());

        return ResponseEntity.ok(aResumen(empresa));
    }

    @GetMapping("/empresas/{id}/historial-suscripcion")
    public ResponseEntity<List<SuscripcionMovimientoDTO>> historialSuscripcion(@PathVariable Long id) {
        List<SuscripcionMovimientoDTO> historial = suscripcionMovimientoRepository
                .findByUsuarioIdOrderByCreadoEnDesc(id).stream()
                .map(m -> SuscripcionMovimientoDTO.builder()
                        .id(m.getId())
                        .dias(m.getDias())
                        .origen(m.getOrigen().name())
                        .adminNombre(m.getAdmin() != null ? m.getAdmin().getNombreDeUsuario() : null)
                        .fechaExpiracionResultante(m.getFechaExpiracionResultante())
                        .creadoEn(m.getCreadoEn())
                        .build())
                .toList();
        return ResponseEntity.ok(historial);
    }

    @PatchMapping("/empresas/{id}/estado")
    public ResponseEntity<EmpresaResumenDTO> cambiarEstado(@PathVariable Long id,
            @RequestBody EstadoEmpresaRequestDTO request) {
        Usuario empresa = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        empresa.setActivo(request.isActivo());
        usuarioRepository.save(empresa);
        return ResponseEntity.ok(aResumen(empresa));
    }

    @PostMapping("/empresas/{id}/reset-password")
    public ResponseEntity<AltaEmpresaResponseDTO> resetearContrasena(@PathVariable Long id) {
        Usuario empresa = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));

        String nuevaContrasena = generarContrasenaTemporal();
        empresa.setContrasena(passwordEncoder.encode(nuevaContrasena));
        usuarioRepository.save(empresa);

        AltaEmpresaResponseDTO response = AltaEmpresaResponseDTO.builder()
                .id(empresa.getId())
                .nombreDeUsuario(empresa.getNombreDeUsuario())
                .contrasenaTemporal(nuevaContrasena)
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/configuracion")
    public ResponseEntity<BigDecimal> obtenerPrecioMensual() {
        BigDecimal precio = configuracionSuscripcionRepository.findById(1L)
                .map(ConfiguracionSuscripcion::getPrecioMensual)
                .orElse(BigDecimal.ZERO);
        return ResponseEntity.ok(precio);
    }

    @PutMapping("/configuracion")
    public ResponseEntity<BigDecimal> actualizarPrecioMensual(@RequestBody ConfiguracionSuscripcionRequestDTO request) {
        String adminActual = jwtService.obtenerNombreDeUsuarioAutenticado();
        Usuario admin = usuarioRepository.findByNombreDeUsuario(adminActual).orElse(null);

        ConfiguracionSuscripcion config = configuracionSuscripcionRepository.findById(1L)
                .orElseGet(() -> ConfiguracionSuscripcion.builder().id(1L).build());
        config.setPrecioMensual(request.getPrecioMensual());
        config.setActualizadoPorAdminId(admin != null ? admin.getId() : null);
        config.setActualizadoEn(LocalDateTime.now());
        configuracionSuscripcionRepository.save(config);

        return ResponseEntity.ok(config.getPrecioMensual());
    }

    private EmpresaResumenDTO aResumen(Usuario empresa) {
        List<OauthToken> cuentas = oauthTokenRepository.findByUsuario(empresa);
        OauthToken cuenta = cuentas.isEmpty() ? null : cuentas.get(0);

        return EmpresaResumenDTO.builder()
                .id(empresa.getId())
                .nombreDeUsuario(empresa.getNombreDeUsuario())
                .correo(empresa.getCorreo())
                .nombre(empresa.getNombre())
                .apellido(empresa.getApellido())
                .nombreEmpresa(empresa.getNombreEmpresa())
                .expiracionSuscripcion(empresa.getExpiracionSuscripcion())
                .suscripcionActiva(empresa.getExpiracionSuscripcion() != null
                        && empresa.getExpiracionSuscripcion().isAfter(LocalDateTime.now()))
                .activo(Boolean.TRUE.equals(empresa.getActivo()))
                .cuentaMpConectada(cuenta != null)
                .cuentaMpActiva(cuenta != null && Boolean.TRUE.equals(cuenta.getActive()))
                .ultimoChequeoPolling(cuenta != null ? cuenta.getLastCheckedAt() : null)
                .build();
    }

    private String generarContrasenaTemporal() {
        String alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            sb.append(alfabeto.charAt(random.nextInt(alfabeto.length())));
        }
        return sb.toString();
    }
}
