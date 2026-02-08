package com.hlms.infrastructure.integration.cibil;

import com.hlms.common.util.enums.CreditBureau;
import com.hlms.domain.customer.port.outbound.CreditBureauPort;
import com.hlms.domain.customer.vo.CibilScore;
import com.hlms.domain.customer.vo.CreditReport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Component
@Profile({"dev", "mock"})
public class CibilMockAdapter implements CreditBureauPort {

    private static final Logger log = LoggerFactory.getLogger(CibilMockAdapter.class);

    @Override
    public CibilScore fetchCreditScore(String pan, String name, LocalDate dob, CreditBureau bureau) {
        log.info("[MOCK] Fetching credit score for PAN: {} from bureau: {}", pan, bureau);
        String reportRef = "REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return new CibilScore(
            750,
            bureau,
            LocalDateTime.now(),
            reportRef,
            true
        );
    }

    @Override
    public CreditReport fetchFullReport(String pan, String consentId, CreditBureau bureau) {
        log.info("[MOCK] Fetching full credit report for PAN: {} with consent: {} from bureau: {}", pan, consentId, bureau);
        String reportRef = "RPT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return new CreditReport(
            750,
            bureau,
            3,
            2,
            new BigDecimal("250000.00"),
            new BigDecimal("15000.00"),
            2,
            0,
            0,
            48,
            LocalDateTime.now(),
            reportRef
        );
    }
}
