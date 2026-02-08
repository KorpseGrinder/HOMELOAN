package com.hlms.application.origination.usecase;

import com.hlms.application.origination.dto.*;
import com.hlms.common.util.enums.ApplicationStatus;
import com.hlms.domain.loan.entity.LoanApplication;
import com.hlms.domain.loan.port.outbound.LoanApplicationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class CreateLeadUseCase {

    private final LoanApplicationRepository repo;

    public CreateLeadUseCase(LoanApplicationRepository repo) {
        this.repo = repo;
    }

    public CreateLeadResponse execute(CreateLeadRequest request) {
        String appNum = "HLMS-" + java.time.Year.now().getValue() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LoanApplication app = LoanApplication.builder()
            .applicationNumber(appNum)
            .status(ApplicationStatus.DRAFT)
            .requestedAmount(request.requestedAmount())
            .requestedTenure(request.requestedTenureMonths())
            .channel(request.channel())
            .purpose(request.purpose())
            .build();
        LoanApplication saved = repo.save(app);
        return new CreateLeadResponse(saved.getId(), saved.getApplicationNumber(), saved.getStatus().name(), LocalDateTime.now());
    }
}
