package com.mpval.validador_backend.mercado_pago.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mpval.validador_backend.mercado_pago.service.OauthTokenService;



@RestController
@RequestMapping("/oauth")
public class OauthTokenController {
    OauthTokenService oauthTokenService;

    public OauthTokenController(OauthTokenService o){
        this.oauthTokenService = o;
    }

    @GetMapping("/init")
    public ResponseEntity<String> init(@RequestBody String entity) {
        try{
            return ResponseEntity.ok(oauthTokenService.UrlAutorizacion());
        }
        catch(Exception e){
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Error al crear URL de autenticacion: "+e.getMessage());
        }
    }

    @GetMapping("/callback")
    public ResponseEntity<String> callback(@RequestParam("code") String code, @RequestParam("state") String state) {
        try {
            oauthTokenService.obtenerAccessToken(code, state);
            return ResponseEntity.ok("Autenticación con Mercado Pago completada correctamente.");
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error al completar la autenticación: " + e.getMessage());
        }
    }

}
