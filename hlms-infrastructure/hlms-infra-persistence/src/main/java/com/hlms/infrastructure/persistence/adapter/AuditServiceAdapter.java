package com.hlms.infrastructure.persistence.adapter;

import com.hlms.common.audit.model.AuditEvent;
import com.hlms.common.audit.port.AuditService;
import com.hlms.infrastructure.persistence.entity.admin.AuditLogJpaEntity;
import com.hlms.infrastructure.persistence.repository.AuditLogJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditServiceAdapter implements AuditService {

    private final AuditLogJpaRepository auditLogJpaRepository;

    @Override
    public void log(AuditEvent event) {
        try {
            AuditLogJpaEntity entity = toEntity(event);
            auditLogJpaRepository.save(entity);
        } catch (Exception e) {
            log.error("Failed to persist audit event: {}", event.action(), e);
        }
    }

    @Override
    @Async
    public void logAsync(AuditEvent event) {
        log(event);
    }

    private AuditLogJpaEntity toEntity(AuditEvent event) {
        return AuditLogJpaEntity.builder()
                .userId(parseUserId(event.userId()))
                .action(event.action())
                .entityType(event.entityType())
                .entityId(event.entityId())
                .oldValue(event.oldValue())
                .newValue(event.newValue())
                .ipAddress(event.ipAddress())
                .actionTimestamp(event.timestamp())
                .build();
    }

    private Long parseUserId(String userId) {
        if (userId == null || userId.isBlank() || "SYSTEM".equals(userId)) {
            return null;
        }
        try {
            return Long.parseLong(userId);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
