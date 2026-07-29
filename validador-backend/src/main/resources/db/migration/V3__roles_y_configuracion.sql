-- Roles: ADMIN general (vos) vs EMPRESA (negocios que usan el validador)
ALTER TABLE usuarios_tb
    ADD COLUMN rol VARCHAR(20) NOT NULL DEFAULT 'EMPRESA',
    ADD COLUMN activo BOOLEAN NOT NULL DEFAULT TRUE;

-- Configuracion de la suscripcion (precio mensual), fila unica editable por el admin
CREATE TABLE configuracion_suscripcion_tb (
    id BIGINT PRIMARY KEY,
    precio_mensual DECIMAL(15,2) NOT NULL,
    actualizado_por_admin_id BIGINT,
    actualizado_en DATETIME
);

INSERT INTO configuracion_suscripcion_tb (id, precio_mensual, actualizado_en)
VALUES (1, 5000.00, NOW());
