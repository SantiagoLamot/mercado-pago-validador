package com.mpval.validador_backend.entidad;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tokens_tb")
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String token;
    private Token_Type token_type = Token_Type.BEARER;
    private Boolean isRevoked;
    private Boolean isExpired;
    @OneToMany
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    public enum Token_Type {
        BEARER
    }
}