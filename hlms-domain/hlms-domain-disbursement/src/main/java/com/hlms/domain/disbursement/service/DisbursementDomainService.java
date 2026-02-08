package com.hlms.domain.disbursement.service;

import com.hlms.common.util.constants.HlmsConstants;
import com.hlms.common.util.enums.*;
import com.hlms.domain.disbursement.entity.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

public class DisbursementDomainService {
    public boolean isPreDisbursementComplete(LoanAgreement agreement, LoanCersai cersai, LoanNachMandate nach, List<LoanInsurance> insurances) {
        boolean agreementSigned = agreement != null && agreement.getStatus() == AgreementStatus.SIGNED;
        boolean cersaiRegistered = cersai != null && cersai.getStatus() == CersaiStatus.REGISTERED;
        boolean nachActive = nach != null && nach.getStatus() == NachMandateStatus.ACTIVE;
        boolean hasInsurance = insurances != null && insurances.stream().anyMatch(LoanInsurance::isActive);
        return agreementSigned && cersaiRegistered && nachActive && hasInsurance;
    }
    public BigDecimal calculatePreEmi(BigDecimal disbursedAmount, BigDecimal annualRate, LocalDate disbursementDate, LocalDate firstEmiDate) {
        long days = ChronoUnit.DAYS.between(disbursementDate, firstEmiDate);
        BigDecimal dailyRate = annualRate.divide(BigDecimal.valueOf(HlmsConstants.DAYS_IN_YEAR * 100L), 10, RoundingMode.HALF_UP);
        return disbursedAmount.multiply(dailyRate).multiply(BigDecimal.valueOf(days)).setScale(HlmsConstants.MONETARY_SCALE, HlmsConstants.ROUNDING_MODE);
    }
}
