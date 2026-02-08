package com.hlms.workflow.disbursement;

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
 * Spring State Machine configuration for the loan disbursement workflow.
 *
 * <p>Defines the post-sanction disbursement lifecycle:
 * <pre>
 * SANCTIONED -> AGREEMENT_SIGNED -> CERSAI_REGISTERED -> NACH_ACTIVE
 *   -> PRE_DISBURSEMENT_COMPLETE -> DISBURSED
 * </pre>
 *
 * <p>Key regulatory steps include:
 * <ul>
 *   <li>Loan agreement execution with e-Sign</li>
 *   <li>CERSAI charge registration (mandatory for housing loans)</li>
 *   <li>NACH mandate activation for EMI auto-debit</li>
 *   <li>Pre-disbursement compliance checks (insurance linkage, valuation confirmation)</li>
 * </ul>
 */
@Configuration
@EnableStateMachineFactory(name = "disbursementStateMachineFactory")
@Slf4j
public class DisbursementStateMachineConfig
        extends EnumStateMachineConfigurerAdapter<DisbursementState, DisbursementEvent> {

    @Override
    public void configure(StateMachineConfigurationConfigurer<DisbursementState, DisbursementEvent> config)
            throws Exception {
        config
            .withConfiguration()
            .autoStartup(false)
            .listener(new StateMachineListenerAdapter<>() {
                @Override
                public void stateChanged(State<DisbursementState, DisbursementEvent> from,
                                         State<DisbursementState, DisbursementEvent> to) {
                    log.info("Disbursement state changed from {} to {}",
                            from != null ? from.getId() : "none", to.getId());
                }
            });
    }

    @Override
    public void configure(StateMachineStateConfigurer<DisbursementState, DisbursementEvent> states)
            throws Exception {
        states
            .withStates()
            .initial(DisbursementState.SANCTIONED)
            .end(DisbursementState.DISBURSED)
            .states(EnumSet.allOf(DisbursementState.class));
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<DisbursementState, DisbursementEvent> transitions)
            throws Exception {

        transitions
            // Sanctioned -> Agreement Signed
            .withExternal()
                .source(DisbursementState.SANCTIONED)
                .target(DisbursementState.AGREEMENT_SIGNED)
                .event(DisbursementEvent.EXECUTE_AGREEMENT)
                .and()

            // Agreement Signed -> CERSAI Registered
            .withExternal()
                .source(DisbursementState.AGREEMENT_SIGNED)
                .target(DisbursementState.CERSAI_REGISTERED)
                .event(DisbursementEvent.REGISTER_CERSAI)
                .and()

            // CERSAI Registered -> NACH Active
            .withExternal()
                .source(DisbursementState.CERSAI_REGISTERED)
                .target(DisbursementState.NACH_ACTIVE)
                .event(DisbursementEvent.ACTIVATE_NACH)
                .and()

            // NACH Active -> Pre-Disbursement Complete
            .withExternal()
                .source(DisbursementState.NACH_ACTIVE)
                .target(DisbursementState.PRE_DISBURSEMENT_COMPLETE)
                .event(DisbursementEvent.COMPLETE_PRE_DISBURSEMENT)
                .and()

            // Pre-Disbursement Complete -> Disbursed
            .withExternal()
                .source(DisbursementState.PRE_DISBURSEMENT_COMPLETE)
                .target(DisbursementState.DISBURSED)
                .event(DisbursementEvent.DISBURSE_FUNDS);
    }
}
