package com.mpval.validador_backend.admin.entity;

public enum OrigenMovimientoSuscripcion {
    /** Cambio hecho a mano por el admin general (sumar/quitar dias, fijar fecha). */
    MANUAL_ADMIN,
    /** Extension automatica al aprobarse un pago de suscripcion en Mercado Pago. */
    PAGO_MP
}
