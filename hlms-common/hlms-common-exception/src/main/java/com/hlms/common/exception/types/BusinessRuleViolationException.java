package com.hlms.common.exception.types;
import com.hlms.common.exception.base.HlmsException;
import java.util.Map;
public class BusinessRuleViolationException extends HlmsException {
    public BusinessRuleViolationException(String errorCode, String message) { super(errorCode, message); }
    public BusinessRuleViolationException(String errorCode, String message, Map<String, String> details) { super(errorCode, message, details); }
}
