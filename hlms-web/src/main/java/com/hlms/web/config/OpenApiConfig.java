package com.hlms.web.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI hlmsOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("HLMS - Housing Loan Management System API")
                        .description("Enterprise-grade Housing Loan Management System for PSU Banks")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("HLMS Development Team")
                                .email("hlms-dev@bank.com"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://www.bank.com")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .bearerFormat("JWT")
                                        .scheme("bearer")));
    }
}
