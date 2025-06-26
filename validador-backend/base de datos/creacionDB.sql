CREATE DATABASE IF NOT EXISTS Mercado_Pago_Validador_DB;
USE Mercado_Pago_Validador_DB;

CREATE TABLE usuarios_tb (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_de_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    nombre_empresa VARCHAR(50),
    expiracion_suscripcion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE oauth_tokens_tb (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    access_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    public_key VARCHAR(255),
    user_id BIGINT,-- ID del vendedor en MP
    expires_at DATETIME NOT NULL,
    live_mode BOOLEAN DEFAULT false,
    usuario_id BIGINT NOT NULL,-- id de usuario de BD propia
    CONSTRAINT fk_oauth_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios_tb(id)
        ON DELETE CASCADE
);

CREATE TABLE state_oauth_tb (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    state VARCHAR(255) NOT NULL,
    usuario_id BIGINT NOT NULL,
    creado DATETIME NOT NULL
);

CREATE TABLE tokens_tb (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(500) UNIQUE,
    token_type ENUM('BEARER') DEFAULT 'BEARER',
    is_revoked BOOLEAN NOT NULL,
    is_expired BOOLEAN NOT NULL,
    usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_token_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios_tb(id) 
        ON DELETE CASCADE
);