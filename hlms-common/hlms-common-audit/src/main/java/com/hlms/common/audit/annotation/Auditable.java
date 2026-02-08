package com.hlms.common.audit.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marks a method for audit logging. When applied, the AuditAspect will
 * capture the user, action, entity details, and before/after values.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {

    /** The action being performed (e.g., CREATE_CUSTOMER, APPROVE_LOAN) */
    String action() default "";

    /** The entity type being acted upon (e.g., CUSTOMER, LOAN_APPLICATION) */
    String entityType() default "";
}
