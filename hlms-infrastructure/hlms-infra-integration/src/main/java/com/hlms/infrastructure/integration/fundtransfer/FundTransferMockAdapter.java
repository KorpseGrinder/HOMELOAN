package com.hlms.infrastructure.integration.fundtransfer;

import com.hlms.domain.disbursement.port.outbound.FundTransferPort;
import com.hlms.domain.disbursement.vo.FundTransferRequest;
import com.hlms.domain.disbursement.vo.FundTransferResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

@Component
@Profile({"dev", "mock"})
public class FundTransferMockAdapter implements FundTransferPort {

    private static final Logger log = LoggerFactory.getLogger(FundTransferMockAdapter.class);

    @Override
    public FundTransferResult transfer(FundTransferRequest request) {
        log.info("[MOCK] Fund transfer: {} to {} amount {}", request.referenceNumber(), request.beneficiaryName(), request.amount());
        String utr = "UTR" + UUID.randomUUID().toString().substring(0, 16).toUpperCase();
        return new FundTransferResult(true, utr, null, LocalDateTime.now());
    }
}
