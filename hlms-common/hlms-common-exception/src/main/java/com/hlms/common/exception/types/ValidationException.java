package com.hlms.common.exception.types;
import com.hlms.common.exception.base.HlmsException;
import java.util.Map;
public class ValidationException extends HlmsException {
    public ValidationException(String errorCode, String message, Map<String, String> fieldErrors) { super(errorCode, message, fieldErrors); }
}
