package com.hlms.infrastructure.messaging.listener;

import com.hlms.infrastructure.messaging.event.ApplicationSubmittedEvent;
import com.hlms.infrastructure.messaging.event.LoanApprovedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class ApplicationEventListener {

    private static final Logger log = LoggerFactory.getLogger(ApplicationEventListener.class);

    @Async
    @EventListener
    public void handleApplicationSubmitted(ApplicationSubmittedEvent event) {
        log.info("Application submitted: {} for customer {}", event.applicationNumber(), event.customerId());
        // TODO: Send SMS/Email notification
    }

    @Async
    @EventListener
    public void handleLoanApproved(LoanApprovedEvent event) {
        log.info("Loan approved: {} amount {}", event.applicationNumber(), event.sanctionedAmount());
        // TODO: Send approval notification
    }
}
