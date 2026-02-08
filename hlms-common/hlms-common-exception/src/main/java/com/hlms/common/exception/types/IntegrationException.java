package com.hlms.common.exception.types;
import com.hlms.common.exception.base.HlmsException;
public class IntegrationException extends HlmsException {
    public IntegrationException(String errorCode, String message) { super(errorCode, message); }
    public IntegrationException(String errorCode, String message, Throwable cause) { super(errorCode, message, cause); }
}
