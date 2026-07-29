package com.mpval.validador_backend.admin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AltaEmpresaRequestDTO {

    @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(max = 50)
    private String nombreDeUsuario;

    @NotBlank(message = "El correo es obligatorio")
    @Email
    @Size(max = 100)
    private String correo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 50)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 50)
    private String apellido;

    @NotBlank(message = "El nombre de la empresa es obligatorio")
    @Size(max = 50)
    private String nombreEmpresa;
}
