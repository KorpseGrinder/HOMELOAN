package com.hlms.infrastructure.messaging.listener;

import com.hlms.infrastructure.messaging.event.DisbursementCompletedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class DisbursementEventListener {

    private static final Logger log = LoggerFactory.getLogger(DisbursementEventListener.class);

    @Async
    @EventListener
    public void handleDisbursementCompleted(DisbursementCompletedEvent event) {
        log.info("Disbursement completed: app {} amount {} UTR {}", event.applicationId(), event.amount(), event.utrNumber());
        // TODO: Send disbursement notification, create loan account
    }
}
