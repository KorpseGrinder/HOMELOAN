package com.hlms.infrastructure.integration.cersai;

import com.hlms.domain.disbursement.port.outbound.CersaiPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Profile({"dev", "mock"})
public class CersaiMockAdapter implements CersaiPort {

    private static final Logger log = LoggerFactory.getLogger(CersaiMockAdapter.class);

    @Override
    public String registerCharge(Long applicationId, Long propertyId) {
        log.info("[MOCK] CERSAI registration for app {} property {}", applicationId, propertyId);
        return "CERSAI-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }

    @Override
    public boolean modifyCharge(String registrationId) {
        log.info("[MOCK] CERSAI modification for {}", registrationId);
        return true;
    }

    @Override
    public boolean satisfyCharge(String registrationId) {
        log.info("[MOCK] CERSAI satisfaction for {}", registrationId);
        return true;
    }
}
