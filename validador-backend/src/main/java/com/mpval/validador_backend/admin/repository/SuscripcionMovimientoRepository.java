package com.mpval.validador_backend.admin.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.admin.entity.SuscripcionMovimiento;

public interface SuscripcionMovimientoRepository extends JpaRepository<SuscripcionMovimiento, Long> {
    List<SuscripcionMovimiento> findByUsuarioIdOrderByCreadoEnDesc(Long usuarioId);
}
