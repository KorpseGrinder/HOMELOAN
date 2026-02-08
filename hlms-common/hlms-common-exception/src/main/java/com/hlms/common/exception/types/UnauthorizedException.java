package com.hlms.common.exception.types;
import com.hlms.common.exception.base.HlmsException;
public class UnauthorizedException extends HlmsException {
    public UnauthorizedException(String errorCode, String message) { super(errorCode, message); }
}
