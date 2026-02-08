package com.hlms.common.util.response;

import java.util.Map;

public record ErrorResponse(String code, String message, Map<String, String> details) {}
