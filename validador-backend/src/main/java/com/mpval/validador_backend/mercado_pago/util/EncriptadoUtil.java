package com.mpval.validador_backend.mercado_pago.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EncriptadoUtil {
    @Value("${algoritmoEncriptar}")
    private String algoritmoEncriptar;
    
    @Value("${secretKeyEncriptar}")
    private String secretKeyEncriptar;

}