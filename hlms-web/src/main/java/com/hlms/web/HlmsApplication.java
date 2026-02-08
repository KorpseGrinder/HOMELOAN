package com.hlms.web;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(scanBasePackages = "com.hlms")
@ConfigurationPropertiesScan(basePackages = "com.hlms")
@EnableJpaRepositories(basePackages = "com.hlms.infrastructure.persistence.repository")
@EntityScan(basePackages = "com.hlms.infrastructure.persistence.entity")
@EnableAsync
public class HlmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(HlmsApplication.class, args);
    }
}
