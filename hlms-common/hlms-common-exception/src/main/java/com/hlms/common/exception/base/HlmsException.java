package com.hlms.common.exception.base;
import java.util.Map;
public class HlmsException extends RuntimeException {
    private final String errorCode;
    private final Map<String, String> details;
    public HlmsException(String errorCode, String message) { super(message); this.errorCode = errorCode; this.details = Map.of(); }
    public HlmsException(String errorCode, String message, Throwable cause) { super(message, cause); this.errorCode = errorCode; this.details = Map.of(); }
    public HlmsException(String errorCode, String message, Map<String, String> details) { super(message); this.errorCode = errorCode; this.details = details != null ? details : Map.of(); }
    public String getErrorCode() { return errorCode; }
    public Map<String, String> getDetails() { return details; }
}
