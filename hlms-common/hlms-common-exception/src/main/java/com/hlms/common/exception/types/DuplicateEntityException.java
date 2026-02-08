package com.hlms.common.exception.types;
import com.hlms.common.exception.base.HlmsException;
public class DuplicateEntityException extends HlmsException {
    public DuplicateEntityException(String errorCode, String entityName, String field, String value) { super(errorCode, String.format("%s already exists with %s: %s", entityName, field, value)); }
}
