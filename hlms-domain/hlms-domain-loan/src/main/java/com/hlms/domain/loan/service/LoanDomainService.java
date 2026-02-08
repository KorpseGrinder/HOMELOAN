package com.hlms.domain.loan.service;

import com.hlms.common.util.constants.HlmsConstants;
import com.hlms.domain.loan.vo.EligibleAmount;
import com.hlms.domain.loan.vo.FoirCalculation;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

public class LoanDomainService {
    public FoirCalculation calculateFoir(BigDecimal grossMonthlyIncome, BigDecimal existingObligations, BigDecimal proposedEmi) {
        BigDecimal total = existingObligations.add(proposedEmi);
        BigDecimal foirRatio = total.divide(grossMonthlyIncome, 4, RoundingMode.HALF_UP);
        boolean eligible = foirRatio.compareTo(new BigDecimal("0.50")) <= 0;
        return new FoirCalculation(grossMonthlyIncome, existingObligations, proposedEmi, foirRatio, eligible);
    }
    public EligibleAmount calculateEligibleAmount(BigDecimal grossMonthlyIncome, BigDecimal existingObligations, BigDecimal interestRate, int tenureMonths, BigDecimal maxFoir) {
        BigDecimal availableForEmi = grossMonthlyIncome.multiply(maxFoir).subtract(existingObligations).setScale(HlmsConstants.MONETARY_SCALE, HlmsConstants.ROUNDING_MODE);
        if (availableForEmi.compareTo(BigDecimal.ZERO) <= 0) return new EligibleAmount(BigDecimal.ZERO, availableForEmi, interestRate, tenureMonths);
        BigDecimal monthlyRate = interestRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal power = onePlusR.pow(tenureMonths, MathContext.DECIMAL128);
        BigDecimal loanAmount = availableForEmi.multiply(power.subtract(BigDecimal.ONE)).divide(monthlyRate.multiply(power), HlmsConstants.MONETARY_SCALE, HlmsConstants.ROUNDING_MODE);
        return new EligibleAmount(loanAmount, availableForEmi, interestRate, tenureMonths);
    }
    public BigDecimal calculateLtv(BigDecimal loanAmount, BigDecimal propertyValue) { if (propertyValue.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO; return loanAmount.divide(propertyValue, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)); }
    public BigDecimal getMaxLtvForAmount(BigDecimal loanAmount) { if (loanAmount.compareTo(new BigDecimal("3000000")) <= 0) return new BigDecimal("90"); if (loanAmount.compareTo(new BigDecimal("7500000")) <= 0) return new BigDecimal("80"); return new BigDecimal("75"); }
}
