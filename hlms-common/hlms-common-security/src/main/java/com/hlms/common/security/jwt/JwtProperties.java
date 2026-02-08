package com.hlms.common.security.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "hlms.security.jwt")
public record JwtProperties(String secret, long accessTokenExpirationMs, long refreshTokenExpirationMs) {

    public JwtProperties {
        if (accessTokenExpirationMs <= 0) accessTokenExpirationMs = 900_000;
        if (refreshTokenExpirationMs <= 0) refreshTokenExpirationMs = 28_800_000;
    }
}
