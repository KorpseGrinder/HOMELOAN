package com.hlms.common.exception.types;
import com.hlms.common.exception.base.HlmsException;
public class EntityNotFoundException extends HlmsException {
    public EntityNotFoundException(String errorCode, String entityName, Object id) { super(errorCode, String.format("%s not found with id: %s", entityName, id)); }
    public EntityNotFoundException(String errorCode, String message) { super(errorCode, message); }
}
