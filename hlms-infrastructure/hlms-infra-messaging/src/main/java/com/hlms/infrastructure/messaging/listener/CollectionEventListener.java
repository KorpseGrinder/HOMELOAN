package com.hlms.infrastructure.messaging.listener;

import com.hlms.infrastructure.messaging.event.NpaClassifiedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class CollectionEventListener {

    private static final Logger log = LoggerFactory.getLogger(CollectionEventListener.class);

    @Async
    @EventListener
    public void handleNpaClassified(NpaClassifiedEvent event) {
        log.info("NPA classified: account {} category {} DPD {}", event.loanAccountId(), event.npaCategory(), event.dpd());
        // TODO: Notify collection team, escalate if needed
    }
}
