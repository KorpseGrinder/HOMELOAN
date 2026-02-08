package com.hlms.workflow.origination;

import lombok.extern.slf4j.Slf4j;
import org.springframework.statemachine.action.Action;
import org.springframework.stereotype.Component;

/**
 * Actions executed during origination state machine transitions.
 *
 * <p>Actions are side effects triggered when a transition occurs. They handle
 * cross-cutting concerns such as notifications, audit trails, and role assignment
 * that accompany every state change in the loan origination lifecycle.
 *
 * <p>In production, these actions would publish domain events to an event bus
 * for asynchronous processing by notification, audit, and assignment services.
 */
@Component
@Slf4j
public class OriginationActions {

    /**
     * Publishes a notification event when a state transition occurs.
     * Notifications are sent to relevant stakeholders (applicant, relationship
     * manager, branch head) based on the target state.
     */
    public Action<OriginationState, OriginationEvent> sendNotificationAction() {
        return context -> {
            OriginationState targetState = context.getTarget().getId();
            log.info("Sending notification for state transition to: {}", targetState);
            // In production: publish NotificationEvent to message broker
            // The notification service determines recipients and channels
            // (SMS, email, in-app) based on the target state
        };
    }

    /**
     * Creates an audit trail entry for every state transition.
     * Captures the source state, target state, triggering event, timestamp,
     * and the user who initiated the transition. Required for regulatory
     * compliance and internal audit requirements.
     */
    public Action<OriginationState, OriginationEvent> createAuditAction() {
        return context -> {
            OriginationState sourceState = context.getSource().getId();
            OriginationState targetState = context.getTarget().getId();
            OriginationEvent event = context.getEvent();
            log.info("Creating audit trail: {} -> {} (event: {})", sourceState, targetState, event);
            // In production: publish AuditEvent with full context including
            // application ID, user ID, timestamp, IP address, and remarks
        };
    }

    /**
     * Determines and assigns the next role in the maker-checker-approver chain
     * based on the workflow state. For example:
     * <ul>
     *   <li>After document upload: assign to KYC verifier</li>
     *   <li>After underwriting: assign to sanctioning authority</li>
     *   <li>After send-back: return to maker for rework</li>
     * </ul>
     */
    public Action<OriginationState, OriginationEvent> assignNextRoleAction() {
        return context -> {
            OriginationState targetState = context.getTarget().getId();
            log.info("Assigning next role based on workflow state: {}", targetState);
            // In production: use RoleAssignmentService to determine the next
            // handler based on branch hierarchy, workload, and authority matrix
        };
    }

    /**
     * Error handler action invoked when a transition action throws an exception.
     * Logs the error details and stores the error in extended state for
     * upstream handling by the application layer.
     */
    public Action<OriginationState, OriginationEvent> errorAction() {
        return context -> {
            Exception exception = context.getException();
            log.error("Error in origination state machine transition: {}",
                    exception != null ? exception.getMessage() : "Unknown error", exception);
            // Store error in extended state for the caller to inspect
            if (exception != null) {
                context.getExtendedState().getVariables()
                        .put("error", exception.getMessage());
            }
        };
    }
}
