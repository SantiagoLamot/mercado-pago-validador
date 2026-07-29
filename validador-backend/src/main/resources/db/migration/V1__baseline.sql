-- Baseline: documenta el esquema tal como fue creado hasta ahora por creacionDB.sql +
-- las tablas que Hibernate generaba solo via ddl-auto=update (transaccion).
-- En bases existentes, Flyway marca esta version como aplicada sin ejecutarla
-- (spring.flyway.baseline-on-migrate=true). En una base nueva, se ejecuta y crea todo.

CREATE TABLE usuarios_tb (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_de_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nombre_empresa VARCHAR(50) NOT NULL,
    expiracion_suscripcion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE oauth_tokens_tb (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    access_token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500) NOT NULL,
    public_key VARCHAR(255),
    user_id BIGINT,
    expires_at DATETIME NOT NULL,
    live_mode BOOLEAN DEFAULT false,
    last_movement_id BIGINT,
    usuario_id BIGINT NOT NULL,
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
    revoked BOOLEAN NOT NULL,
    expired BOOLEAN NOT NULL,
    usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_token_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios_tb(id)
        ON DELETE CASCADE
);

CREATE TABLE transaccion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(255),
    fecha DATETIME,
    id_usuario BIGINT,
    CONSTRAINT fk_transaccion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuarios_tb(id)
);
