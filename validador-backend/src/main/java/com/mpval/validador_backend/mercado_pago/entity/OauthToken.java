package com.mpval.validador_backend.mercado_pago.entity;

import java.time.LocalDateTime;

import com.mpval.validador_backend.Usuario.entity.Usuario;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "oauth_tokens_tb")
public class OauthToken {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    
    private String accessToken;
    private String refreshToken;
    private String publicKey;
    private Long userId;
    private LocalDateTime expiresAt;
    private Boolean liveMode;
    private Long lastMovementId;
    
    @OneToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
}