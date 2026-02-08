package com.hlms.workflow.collection;

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
 * Spring State Machine configuration for the loan collection / asset classification workflow.
 *
 * <p>Models the RBI IRAC (Income Recognition and Asset Classification) norms
 * for tracking loan accounts through various stages of delinquency and resolution.
 *
 * <p>State transitions follow the DPD (Days Past Due) bucket framework:
 * <pre>
 * CURRENT -> SMA_0 (1-30 DPD) -> SMA_1 (31-60 DPD) -> SMA_2 (61-90 DPD)
 *   -> NPA_SUBSTANDARD (90+ DPD, up to 12 months)
 *   -> NPA_DOUBTFUL (NPA > 12 months)
 *   -> NPA_LOSS (identified by bank/auditor)
 * </pre>
 *
 * <p>Recovery paths:
 * <ul>
 *   <li>PAYMENT_RECEIVED: clears overdue, returns to CURRENT</li>
 *   <li>RESTRUCTURE: enters RESTRUCTURED state under RBI restructuring norms</li>
 *   <li>RESOLVE: full settlement or closure, enters RESOLVED terminal state</li>
 *   <li>UPGRADE: NPA account upgraded back to performing after sustained recovery</li>
 * </ul>
 */
@Configuration
@EnableStateMachineFactory(name = "collectionStateMachineFactory")
@Slf4j
public class CollectionStateMachineConfig
        extends EnumStateMachineConfigurerAdapter<CollectionState, CollectionEvent> {

    @Override
    public void configure(StateMachineConfigurationConfigurer<CollectionState, CollectionEvent> config)
            throws Exception {
        config
            .withConfiguration()
            .autoStartup(false)
            .listener(new StateMachineListenerAdapter<>() {
                @Override
                public void stateChanged(State<CollectionState, CollectionEvent> from,
                                         State<CollectionState, CollectionEvent> to) {
                    log.info("Collection state changed from {} to {}",
                            from != null ? from.getId() : "none", to.getId());
                }
            });
    }

    @Override
    public void configure(StateMachineStateConfigurer<CollectionState, CollectionEvent> states)
            throws Exception {
        states
            .withStates()
            .initial(CollectionState.CURRENT)
            .end(CollectionState.RESOLVED)
            .states(EnumSet.allOf(CollectionState.class));
    }

    @Override
    public void configure(StateMachineTransitionConfigurer<CollectionState, CollectionEvent> transitions)
            throws Exception {

        transitions
            // --- Forward delinquency escalation (DPD-based) ---

            // Current -> SMA-0 (1-30 DPD)
            .withExternal()
                .source(CollectionState.CURRENT)
                .target(CollectionState.SMA_0)
                .event(CollectionEvent.PAYMENT_OVERDUE)
                .and()

            // SMA-0 -> SMA-1 (31-60 DPD)
            .withExternal()
                .source(CollectionState.SMA_0)
                .target(CollectionState.SMA_1)
                .event(CollectionEvent.ESCALATE_SMA1)
                .and()

            // SMA-1 -> SMA-2 (61-90 DPD)
            .withExternal()
                .source(CollectionState.SMA_1)
                .target(CollectionState.SMA_2)
                .event(CollectionEvent.ESCALATE_SMA2)
                .and()

            // SMA-2 -> NPA Substandard (90+ DPD)
            .withExternal()
                .source(CollectionState.SMA_2)
                .target(CollectionState.NPA_SUBSTANDARD)
                .event(CollectionEvent.CLASSIFY_NPA)
                .and()

            // NPA Substandard -> NPA Doubtful (NPA > 12 months)
            .withExternal()
                .source(CollectionState.NPA_SUBSTANDARD)
                .target(CollectionState.NPA_DOUBTFUL)
                .event(CollectionEvent.DOWNGRADE_DOUBTFUL)
                .and()

            // NPA Doubtful -> NPA Loss
            .withExternal()
                .source(CollectionState.NPA_DOUBTFUL)
                .target(CollectionState.NPA_LOSS)
                .event(CollectionEvent.DOWNGRADE_LOSS)
                .and()

            // --- Recovery / Resolution transitions ---

            // SMA-0 -> Current (payment received, clears overdue)
            .withExternal()
                .source(CollectionState.SMA_0)
                .target(CollectionState.CURRENT)
                .event(CollectionEvent.PAYMENT_RECEIVED)
                .and()

            // SMA-1 -> Current (payment received)
            .withExternal()
                .source(CollectionState.SMA_1)
                .target(CollectionState.CURRENT)
                .event(CollectionEvent.PAYMENT_RECEIVED)
                .and()

            // SMA-2 -> Current (payment received before NPA classification)
            .withExternal()
                .source(CollectionState.SMA_2)
                .target(CollectionState.CURRENT)
                .event(CollectionEvent.PAYMENT_RECEIVED)
                .and()

            // NPA Substandard -> Current (upgrade after sustained recovery)
            .withExternal()
                .source(CollectionState.NPA_SUBSTANDARD)
                .target(CollectionState.CURRENT)
                .event(CollectionEvent.UPGRADE)
                .and()

            // --- Restructuring transitions ---

            // SMA-2 -> Restructured
            .withExternal()
                .source(CollectionState.SMA_2)
                .target(CollectionState.RESTRUCTURED)
                .event(CollectionEvent.RESTRUCTURE)
                .and()

            // NPA Substandard -> Restructured
            .withExternal()
                .source(CollectionState.NPA_SUBSTANDARD)
                .target(CollectionState.RESTRUCTURED)
                .event(CollectionEvent.RESTRUCTURE)
                .and()

            // NPA Doubtful -> Restructured
            .withExternal()
                .source(CollectionState.NPA_DOUBTFUL)
                .target(CollectionState.RESTRUCTURED)
                .event(CollectionEvent.RESTRUCTURE)
                .and()

            // Restructured -> Current (successful restructuring, account performing again)
            .withExternal()
                .source(CollectionState.RESTRUCTURED)
                .target(CollectionState.CURRENT)
                .event(CollectionEvent.PAYMENT_RECEIVED)
                .and()

            // Restructured -> NPA Substandard (restructured account slips again)
            .withExternal()
                .source(CollectionState.RESTRUCTURED)
                .target(CollectionState.NPA_SUBSTANDARD)
                .event(CollectionEvent.CLASSIFY_NPA)
                .and()

            // --- Terminal resolution transitions ---

            // Any NPA state -> Resolved (settlement, write-off, or full recovery)
            .withExternal()
                .source(CollectionState.NPA_SUBSTANDARD)
                .target(CollectionState.RESOLVED)
                .event(CollectionEvent.RESOLVE)
                .and()

            .withExternal()
                .source(CollectionState.NPA_DOUBTFUL)
                .target(CollectionState.RESOLVED)
                .event(CollectionEvent.RESOLVE)
                .and()

            .withExternal()
                .source(CollectionState.NPA_LOSS)
                .target(CollectionState.RESOLVED)
                .event(CollectionEvent.RESOLVE)
                .and()

            .withExternal()
                .source(CollectionState.RESTRUCTURED)
                .target(CollectionState.RESOLVED)
                .event(CollectionEvent.RESOLVE);
    }
}
