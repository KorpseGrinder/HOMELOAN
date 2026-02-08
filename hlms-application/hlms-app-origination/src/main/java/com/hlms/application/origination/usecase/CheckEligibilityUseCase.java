package com.hlms.application.origination.usecase;

import com.hlms.application.origination.dto.EligibilityResponse;
import com.hlms.common.exception.types.EntityNotFoundException;
import com.hlms.common.util.constants.ErrorCodes;
import com.hlms.domain.customer.entity.Customer;
import com.hlms.domain.customer.port.outbound.CustomerRepository;
import com.hlms.domain.customer.service.CustomerDomainService;
import com.hlms.domain.loan.entity.LoanApplication;
import com.hlms.domain.loan.port.outbound.LoanApplicationRepository;
import com.hlms.domain.loan.service.LoanDomainService;
import com.hlms.domain.loan.vo.EligibleAmount;
import com.hlms.domain.loan.vo.FoirCalculation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@Transactional(readOnly = true)
public class CheckEligibilityUseCase {

    private final LoanApplicationRepository appRepo;
    private final CustomerRepository custRepo;
    private final LoanDomainService loanService;
    private final CustomerDomainService custService;

    public CheckEligibilityUseCase(LoanApplicationRepository appRepo, CustomerRepository custRepo,
                                   LoanDomainService loanService, CustomerDomainService custService) {
        this.appRepo = appRepo;
        this.custRepo = custRepo;
        this.loanService = loanService;
        this.custService = custService;
    }

    public EligibilityResponse execute(Long applicationId) {
        LoanApplication app = appRepo.findById(applicationId)
            .orElseThrow(() -> new EntityNotFoundException(ErrorCodes.APPLICATION_NOT_FOUND, "LoanApplication", applicationId));

        Customer customer = custRepo.findById(app.getCustomerId())
            .orElseThrow(() -> new EntityNotFoundException(ErrorCodes.CUSTOMER_NOT_FOUND, "Customer", app.getCustomerId()));

        BigDecimal monthlyIncome = custService.calculateNetMonthlyIncome(customer);
        EligibleAmount ea = loanService.calculateEligibleAmount(
            monthlyIncome,
            BigDecimal.ZERO,
            new BigDecimal("8.50"),
            app.getRequestedTenure(),
            new BigDecimal("0.50")
        );
        FoirCalculation foir = loanService.calculateFoir(monthlyIncome, BigDecimal.ZERO, ea.maxEmi());
        boolean eligible = ea.eligibleLoanAmount().compareTo(app.getRequestedAmount()) >= 0;

        return new EligibilityResponse(
            eligible,
            ea.eligibleLoanAmount(),
            ea.maxEmi(),
            foir.foirRatio(),
            BigDecimal.ZERO,
            0,
            eligible ? "Eligible" : "Ineligible"
        );
    }
}
