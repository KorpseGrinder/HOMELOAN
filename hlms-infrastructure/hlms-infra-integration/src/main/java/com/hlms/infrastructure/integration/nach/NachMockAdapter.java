package com.hlms.infrastructure.integration.nach;

import com.hlms.domain.disbursement.entity.LoanNachMandate;
import com.hlms.domain.disbursement.port.outbound.NachPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Profile({"dev", "mock"})
public class NachMockAdapter implements NachPort {

    private static final Logger log = LoggerFactory.getLogger(NachMockAdapter.class);

    @Override
    public String createMandate(LoanNachMandate mandate) {
        log.info("[MOCK] Creating NACH mandate for app {}", mandate.getApplicationId());
        return "UMRN-" + UUID.randomUUID().toString().substring(0, 16).toUpperCase();
    }

    @Override
    public boolean cancelMandate(String umrn) {
        log.info("[MOCK] Cancelling NACH mandate {}", umrn);
        return true;
    }
}
