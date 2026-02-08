package com.hlms.common.audit.model;

import java.time.LocalDateTime;

/**
 * Immutable audit event record capturing all details of an auditable operation.
 */
public record AuditEvent(
    String userId,
    String action,
    String entityType,
    String entityId,
    String oldValue,
    String newValue,
    String ipAddress,
    LocalDateTime timestamp
) {
    public AuditEvent {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }

    public static AuditEventBuilder builder() {
        return new AuditEventBuilder();
    }

    public static class AuditEventBuilder {
        private String userId;
        private String action;
        private String entityType;
        private String entityId;
        private String oldValue;
        private String newValue;
        private String ipAddress;
        private LocalDateTime timestamp;

        public AuditEventBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public AuditEventBuilder action(String action) {
            this.action = action;
            return this;
        }

        public AuditEventBuilder entityType(String entityType) {
            this.entityType = entityType;
            return this;
        }

        public AuditEventBuilder entityId(String entityId) {
            this.entityId = entityId;
            return this;
        }

        public AuditEventBuilder oldValue(String oldValue) {
            this.oldValue = oldValue;
            return this;
        }

        public AuditEventBuilder newValue(String newValue) {
            this.newValue = newValue;
            return this;
        }

        public AuditEventBuilder ipAddress(String ipAddress) {
            this.ipAddress = ipAddress;
            return this;
        }

        public AuditEventBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public AuditEvent build() {
            return new AuditEvent(
                userId,
                action,
                entityType,
                entityId,
                oldValue,
                newValue,
                ipAddress,
                timestamp != null ? timestamp : LocalDateTime.now()
            );
        }
    }
}
