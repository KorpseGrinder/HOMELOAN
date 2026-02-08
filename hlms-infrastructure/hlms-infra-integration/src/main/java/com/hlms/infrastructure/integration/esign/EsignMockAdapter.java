package com.hlms.infrastructure.integration.esign;

import com.hlms.domain.disbursement.port.outbound.EsignPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Profile({"dev", "mock"})
public class EsignMockAdapter implements EsignPort {

    private static final Logger log = LoggerFactory.getLogger(EsignMockAdapter.class);

    @Override
    public String initiateEsign(Long applicationId, byte[] document) {
        log.info("[MOCK] Initiating e-sign for app {}", applicationId);
        return "ESIGN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }

    @Override
    public boolean verifyEsign(String esignReference) {
        log.info("[MOCK] Verifying e-sign {}", esignReference);
        return true;
    }
}
