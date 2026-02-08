package com.hlms.infrastructure.persistence.entity.admin;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "AUDIT_LOG")
public class AuditLogJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_audit") @SequenceGenerator(name = "seq_audit", sequenceName = "SEQ_AUDIT_LOG_ID", allocationSize = 1) @Column(name = "AUDIT_ID") private Long id;
    @Column(name = "USER_ID") private Long userId;
    @Column(name = "ACTION") private String action;
    @Column(name = "ENTITY_TYPE") private String entityType;
    @Column(name = "ENTITY_ID") private String entityId;
    @Lob @Column(name = "OLD_VALUE") private String oldValue;
    @Lob @Column(name = "NEW_VALUE") private String newValue;
    @Column(name = "IP_ADDRESS") private String ipAddress;
    @Column(name = "USER_AGENT") private String userAgent;
    @Column(name = "ACTION_TIMESTAMP") private LocalDateTime actionTimestamp;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); }
}
