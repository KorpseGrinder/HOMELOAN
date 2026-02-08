package com.hlms.web.controller;

import com.hlms.common.security.jwt.JwtTokenProvider;
import com.hlms.common.util.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@RequestBody Map<String, String> creds) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(creds.get("username"), creds.get("password"))
        );

        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication.getName());

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken,
                "tokenType", "Bearer",
                "expiresIn", "900"
        )));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<Map<String, String>>> refresh(@RequestBody Map<String, String> req) {
        String refreshToken = req.get("refreshToken");
        if (jwtTokenProvider.validateToken(refreshToken)) {
            String username = jwtTokenProvider.getUsernameFromToken(refreshToken);
            String newAccessToken = jwtTokenProvider.generateRefreshToken(username);
            return ResponseEntity.ok(ApiResponse.success(Map.of(
                    "accessToken", newAccessToken,
                    "tokenType", "Bearer"
            )));
        }
        return ResponseEntity.badRequest().body(ApiResponse.error("HLMS-AUTH-001", "Invalid refresh token"));
    }
}
