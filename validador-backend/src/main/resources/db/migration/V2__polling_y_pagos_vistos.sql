-- Cuentas conectadas: soporte para el worker de polling de respaldo
ALTER TABLE oauth_tokens_tb
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN last_checked_at DATETIME NULL,
    ADD COLUMN check_interval_seconds INT NOT NULL DEFAULT 30;

-- Dedupe de pagos ya notificados (webhook y/o polling)
CREATE TABLE pagos_vistos_tb (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mp_payment_id BIGINT NOT NULL UNIQUE,
    mp_account_id BIGINT NOT NULL,
    amount DECIMAL(15,2),
    operation_type VARCHAR(50),
    payment_type_id VARCHAR(50),
    date_created DATETIME,
    notified_at DATETIME,
    CONSTRAINT fk_pago_visto_cuenta
        FOREIGN KEY (mp_account_id)
        REFERENCES oauth_tokens_tb(id)
        ON DELETE CASCADE
);
