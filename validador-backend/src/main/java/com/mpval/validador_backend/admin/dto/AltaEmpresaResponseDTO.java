package com.mpval.validador_backend.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AltaEmpresaResponseDTO {
    private Long id;
    private String nombreDeUsuario;
    private String contrasenaTemporal;
}
