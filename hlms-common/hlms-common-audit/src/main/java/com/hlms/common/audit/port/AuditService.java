package com.hlms.common.audit.port;

import com.hlms.common.audit.model.AuditEvent;

/**
 * Port interface for persisting audit events.
 * Implemented in the infrastructure (persistence) layer.
 */
public interface AuditService {

    /** Log a single audit event */
    void log(AuditEvent event);

    /** Log an audit event asynchronously */
    void logAsync(AuditEvent event);
}
