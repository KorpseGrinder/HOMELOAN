package com.hlms.common.audit.aspect;

import com.hlms.common.audit.annotation.Auditable;
import com.hlms.common.audit.model.AuditEvent;
import com.hlms.common.audit.port.AuditService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * AOP aspect that intercepts methods annotated with {@link Auditable} and
 * captures audit trail information including the user, action, entity details,
 * and before/after state snapshots.
 */
@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditService auditService;
    private final ObjectMapper objectMapper;

    @Around("@annotation(auditable)")
    public Object auditMethod(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {
        String userId = getCurrentUserId();
        String ipAddress = getClientIpAddress();
        String action = auditable.action().isEmpty()
            ? joinPoint.getSignature().getName()
            : auditable.action();
        String entityType = auditable.entityType().isEmpty()
            ? inferEntityType(joinPoint)
            : auditable.entityType();

        // Capture arguments as old state context
        String inputSnapshot = serializeArgs(joinPoint.getArgs());

        // Execute the actual method
        Object result = joinPoint.proceed();

        // Capture result as new state
        String outputSnapshot = serializeResult(result);

        // Extract entity ID from result if possible
        String entityId = extractEntityId(result);

        // Build and log audit event
        AuditEvent event = AuditEvent.builder()
            .userId(userId)
            .action(action)
            .entityType(entityType)
            .entityId(entityId)
            .oldValue(inputSnapshot)
            .newValue(outputSnapshot)
            .ipAddress(ipAddress)
            .timestamp(LocalDateTime.now())
            .build();

        try {
            auditService.logAsync(event);
        } catch (Exception e) {
            log.error("Failed to log audit event for action: {}", action, e);
            // Do not fail the business operation due to audit failure
        }

        return result;
    }

    private String getCurrentUserId() {
        return Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .map(Authentication::getName)
            .orElse("SYSTEM");
    }

    private String getClientIpAddress() {
        try {
            ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            log.debug("Could not determine client IP", e);
        }
        return "unknown";
    }

    private String inferEntityType(ProceedingJoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        return className.replace("UseCase", "")
                       .replace("Service", "")
                       .replace("Controller", "");
    }

    private String serializeArgs(Object[] args) {
        try {
            return objectMapper.writeValueAsString(args);
        } catch (Exception e) {
            log.debug("Could not serialize method arguments", e);
            return "[]";
        }
    }

    private String serializeResult(Object result) {
        try {
            return objectMapper.writeValueAsString(result);
        } catch (Exception e) {
            log.debug("Could not serialize method result", e);
            return "null";
        }
    }

    private String extractEntityId(Object result) {
        if (result == null) {
            return null;
        }
        try {
            var idMethod = result.getClass().getMethod("getId");
            Object id = idMethod.invoke(result);
            return id != null ? id.toString() : null;
        } catch (NoSuchMethodException e) {
            // No getId method, try id field
            try {
                var idField = result.getClass().getDeclaredField("id");
                idField.setAccessible(true);
                Object id = idField.get(result);
                return id != null ? id.toString() : null;
            } catch (Exception ex) {
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }
}
