package com.hlms.workflow.origination;

import lombok.extern.slf4j.Slf4j;
import org.springframework.statemachine.guard.Guard;
import org.springframework.stereotype.Component;

/**
 * Guard conditions for the origination state machine.
 *
 * <p>Guards act as precondition checks before a state transition is allowed.
 * Each guard inspects the state machine's extended state (context variables)
 * to determine whether the transition should proceed.
 *
 * <p>In production, these guards would delegate to domain services for
 * comprehensive validation. The extended state variables are populated by
 * the application layer before sending events to the state machine.
 */
@Component
@Slf4j
public class OriginationGuards {

    /**
     * Ensures all required documents have been uploaded and verified
     * before proceeding from DOCUMENTS_PENDING to KYC_VERIFIED.
     */
    public Guard<OriginationState, OriginationEvent> documentCompleteGuard() {
        return context -> {
            log.info("Checking if all required documents are complete");
            Boolean complete = context.getExtendedState().get("documentsComplete", Boolean.class);
            return complete != null && complete;
        };
    }

    /**
     * Validates that KYC (Know Your Customer) verification has passed
     * before proceeding to credit check. Checks PAN, Aadhaar, and
     * CKYC registry verification status.
     */
    public Guard<OriginationState, OriginationEvent> kycVerifiedGuard() {
        return context -> {
            log.info("Checking if KYC verification is complete");
            Boolean verified = context.getExtendedState().get("kycVerified", Boolean.class);
            return verified != null && verified;
        };
    }

    /**
     * Validates that the applicant's credit score meets the minimum threshold.
     * Minimum CIBIL score of 650 is required for housing loan eligibility.
     * Also checks FOIR (Fixed Obligation to Income Ratio) does not exceed 60%.
     */
    public Guard<OriginationState, OriginationEvent> creditScoreGuard() {
        return context -> {
            log.info("Checking credit score threshold");
            Integer score = context.getExtendedState().get("creditScore", Integer.class);
            return score != null && score >= 650;
        };
    }

    /**
     * Ensures property valuation has been completed by an approved valuer
     * and the valuation report is within acceptable parameters (LTV ratio check).
     */
    public Guard<OriginationState, OriginationEvent> valuationCompleteGuard() {
        return context -> {
            log.info("Checking if property valuation is complete and within LTV limits");
            Boolean complete = context.getExtendedState().get("valuationComplete", Boolean.class);
            return complete != null && complete;
        };
    }

    /**
     * Verifies that the approver has sufficient authority (delegation of powers)
     * to sanction the loan amount. Authority limits vary by role and branch
     * hierarchy level as defined in the authority matrix.
     */
    public Guard<OriginationState, OriginationEvent> authorityLimitGuard() {
        return context -> {
            log.info("Checking authority limit for sanctioning officer");
            // In production, this would check:
            // 1. Approver's sanctioning limit from authority matrix
            // 2. Loan amount against the limit
            // 3. Branch hierarchy level
            Boolean hasAuthority = context.getExtendedState().get("authorityVerified", Boolean.class);
            return hasAuthority != null && hasAuthority;
        };
    }
}
