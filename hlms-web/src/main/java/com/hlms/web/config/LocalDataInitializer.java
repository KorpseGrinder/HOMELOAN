package com.hlms.web.config;

import com.hlms.infrastructure.persistence.entity.admin.UserMasterJpaEntity;
import com.hlms.infrastructure.persistence.repository.UserMasterJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("local")
@RequiredArgsConstructor
@Slf4j
public class LocalDataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initLocalData(UserMasterJpaRepository userRepository) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                UserMasterJpaEntity admin = UserMasterJpaEntity.builder()
                        .username("admin")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .firstName("Admin")
                        .lastName("User")
                        .email("admin@hlms.com")
                        .isActive(true)
                        .accountLocked(false)
                        .failedLoginAttempts(0)
                        .build();
                userRepository.save(admin);
                log.info("Created default admin user for local development");
            }
        };
    }
}
