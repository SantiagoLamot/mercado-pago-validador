package com.mpval.validador_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ValidadorBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(ValidadorBackendApplication.class, args);
	}
}
