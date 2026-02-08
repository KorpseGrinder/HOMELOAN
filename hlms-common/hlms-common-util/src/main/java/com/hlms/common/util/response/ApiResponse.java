package com.hlms.common.util.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(boolean success, T data, ErrorResponse error, LocalDateTime timestamp) {

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, null, new ErrorResponse(code, message, null), LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(String code, String message, Map<String, String> details) {
        return new ApiResponse<>(false, null, new ErrorResponse(code, message, details), LocalDateTime.now());
    }
}
