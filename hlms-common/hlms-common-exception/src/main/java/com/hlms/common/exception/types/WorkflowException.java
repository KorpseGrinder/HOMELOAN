package com.hlms.common.exception.types;
import com.hlms.common.exception.base.HlmsException;
public class WorkflowException extends HlmsException {
    public WorkflowException(String errorCode, String message) { super(errorCode, message); }
    public WorkflowException(String errorCode, String message, Throwable cause) { super(errorCode, message, cause); }
}
