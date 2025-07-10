package com.mpval.validador_backend.mercado_pago.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mpval.validador_backend.mercado_pago.entity.Transaccion;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long>{
    
}
