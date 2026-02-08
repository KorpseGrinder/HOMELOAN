package com.hlms.workflow.origination;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.statemachine.config.EnableStateMachineFactory;
import org.springframework.statemachine.config.EnumStateMachineConfigurerAdapter;
import org.springframework.statemachine.config.builders.StateMachineConfigurationConfigurer;
import org.springframework.statemachine.config.builders.StateMachineStateConfigurer;
import org.springframework.statemachine.config.builders.StateMachineTransitionConfigurer;
import org.springframework.statemachine.listener.StateMachineListenerAdapter;
import org.springframework.statemachine.state.State;

import java.util.EnumSet;

/**
 * Spring State Machine configuration for the loan origination workflow.
 *
 * <p>Defines the complete lifecycle from lead capture through sanction/rejection:
 * <pre>
 * LEAD_CAPTURED -> APPLICATION_CREATED -> DOCUMENTS_PENDING -> KYC_VERIFIED
 *   -> CREDIT_CHECK_COMPLETED -> PROPERTY_VALUATION_COMPLETED
 *   -> UNDERWRITING_COMPLETED -> PENDING_APPROVAL -> SANCTIONED / REJECTED
 * </pre>
 *
 * <p>The SEND_BACK event allows returning to earlier states for rework,
 * supporting the maker-checker-approver pattern required by PSU bank processes.
 */
@Configuration
@EnableStateMachineFactory(name = "originationStateMachineFactory")
@RequiredArgsConstructor
@Slf4j
public class OriginationStateMachineConfig
        extends EnumStateMachineConfigurerAdapter<OriginationState, OriginationEvent> {

    private final OriginationGuards originationGuards;
    private final OriginationActions originationActions;

    @Override
    public void configure(StateMachineConfigurationConfigurer<OriginationState, OriginationEvent> config)
            throws Exception {
        config
            .withConfiguration()
            .autoStartup(false)
            .listener(new StateMachineListenerAdapter<>() {
                @Override
                public void stateChanged(State<OriginationState, OriginationEvent> from,
                                         State<OriginationState, OriginationEvent> to) {
                    log.info("Origination state changed from {} to {}",
                            from != null ? from.getId() : "none", to.getId());
                }
            });
    }

    @Override
    public void configure(StateMachineStateConfigurer<OriginationState, OriginationEvent> states)
            throws Exception {
        states
            .withStates()
            .initial(OriginationState.LEAD_CAPTURED)
            .end(OriginationState.SANCTIONED)
            .end(OriginationState.REJECTED)
            .states(EnumSet.allOf(OriginationState.class));
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<OriginationState, OriginationEvent> transitions)
            throws Exception {

        transitions
            // Lead -> Application
            .withExternal()
                .source(OriginationState.LEAD_CAPTURED)
                .target(OriginationState.APPLICATION_CREATED)
                .event(OriginationEvent.CREATE_APPLICATION)
                .action(originationActions.createAuditAction(), originationActions.errorAction())
                .and()

            // Application -> Documents Pending
            .withExternal()
                .source(OriginationState.APPLICATION_CREATED)
                .target(OriginationState.DOCUMENTS_PENDING)
                .event(OriginationEvent.UPLOAD_DOCUMENTS)
                .action(originationActions.sendNotificationAction(), originationActions.errorAction())
                .and()

            // Documents Pending -> KYC Verified
            .withExternal()
                .source(OriginationState.DOCUMENTS_PENDING)
                .target(OriginationState.KYC_VERIFIED)
                .event(OriginationEvent.VERIFY_KYC)
                .guard(originationGuards.documentCompleteGuard())
                .action(originationActions.createAuditAction(), originationActions.errorAction())
                .and()

            // KYC Verified -> Credit Check Completed
            .withExternal()
                .source(OriginationState.KYC_VERIFIED)
                .target(OriginationState.CREDIT_CHECK_COMPLETED)
                .event(OriginationEvent.COMPLETE_CREDIT_CHECK)
                .guard(originationGuards.kycVerifiedGuard())
                .action(originationActions.createAuditAction(), originationActions.errorAction())
                .and()

            // Credit Check -> Property Valuation
            .withExternal()
                .source(OriginationState.CREDIT_CHECK_COMPLETED)
                .target(OriginationState.PROPERTY_VALUATION_COMPLETED)
                .event(OriginationEvent.COMPLETE_VALUATION)
                .guard(originationGuards.creditScoreGuard())
                .action(originationActions.createAuditAction(), originationActions.errorAction())
                .and()

            // Property Valuation -> Underwriting
            .withExternal()
                .source(OriginationState.PROPERTY_VALUATION_COMPLETED)
                .target(OriginationState.UNDERWRITING_COMPLETED)
                .event(OriginationEvent.COMPLETE_UNDERWRITING)
                .guard(originationGuards.valuationCompleteGuard())
                .action(originationActions.createAuditAction(), originationActions.errorAction())
                .and()

            // Underwriting -> Pending Approval
            .withExternal()
                .source(OriginationState.UNDERWRITING_COMPLETED)
                .target(OriginationState.PENDING_APPROVAL)
                .event(OriginationEvent.APPROVE)
                .action(originationActions.assignNextRoleAction(), originationActions.errorAction())
                .and()

            // Pending Approval -> Sanctioned
            .withExternal()
                .source(OriginationState.PENDING_APPROVAL)
                .target(OriginationState.SANCTIONED)
                .event(OriginationEvent.APPROVE)
                .guard(originationGuards.authorityLimitGuard())
                .action(originationActions.sendNotificationAction(), originationActions.errorAction())
                .and()

            // --- Rejection transitions (can reject from multiple stages) ---

            .withExternal()
                .source(OriginationState.CREDIT_CHECK_COMPLETED)
                .target(OriginationState.REJECTED)
                .event(OriginationEvent.REJECT)
                .action(originationActions.sendNotificationAction(), originationActions.errorAction())
                .and()

            .withExternal()
                .source(OriginationState.PROPERTY_VALUATION_COMPLETED)
                .target(OriginationState.REJECTED)
                .event(OriginationEvent.REJECT)
                .action(originationActions.sendNotificationAction(), originationActions.errorAction())
                .and()

            .withExternal()
                .source(OriginationState.UNDERWRITING_COMPLETED)
                .target(OriginationState.REJECTED)
                .event(OriginationEvent.REJECT)
                .action(originationActions.sendNotificationAction(), originationActions.errorAction())
                .and()

            .withExternal()
                .source(OriginationState.PENDING_APPROVAL)
                .target(OriginationState.REJECTED)
                .event(OriginationEvent.REJECT)
                .action(originationActions.sendNotificationAction(), originationActions.errorAction())
                .and()

            // --- Send-back transitions (rework / maker-checker loop) ---

            .withExternal()
                .source(OriginationState.KYC_VERIFIED)
                .target(OriginationState.DOCUMENTS_PENDING)
                .event(OriginationEvent.SEND_BACK)
                .action(originationActions.sendNotificationAction(), originationActions.errorAction())
                .and()

            .withExternal()
                .source(OriginationState.PENDING_APPROVAL)
                .target(OriginationState.UNDERWRITING_COMPLETED)
                .event(OriginationEvent.SEND_BACK)
                .action(originationActions.sendNotificationAction(), originationActions.errorAction());
    }
}
