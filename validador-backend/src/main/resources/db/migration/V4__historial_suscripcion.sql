CREATE TABLE suscripcion_movimientos_tb (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    dias INT NULL,
    origen VARCHAR(20) NOT NULL,
    admin_id BIGINT NULL,
    fecha_expiracion_resultante DATETIME NULL,
    creado_en DATETIME NOT NULL,
    CONSTRAINT fk_movimiento_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios_tb(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_movimiento_admin
        FOREIGN KEY (admin_id)
        REFERENCES usuarios_tb(id)
        ON DELETE SET NULL
);
