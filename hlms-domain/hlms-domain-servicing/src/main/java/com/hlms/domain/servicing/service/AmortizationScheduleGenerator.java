package com.hlms.domain.servicing.service;

import com.hlms.common.util.constants.HlmsConstants;
import com.hlms.domain.servicing.entity.RepaymentSchedule;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class AmortizationScheduleGenerator {
    private final EmiCalculator emiCalculator;
    public AmortizationScheduleGenerator(EmiCalculator emiCalculator) { this.emiCalculator = emiCalculator; }
    public List<RepaymentSchedule> generate(Long loanAccountId, BigDecimal principal, BigDecimal annualRate, int tenureMonths, LocalDate firstEmiDate) {
        List<RepaymentSchedule> schedule = new ArrayList<>();
        BigDecimal emi = emiCalculator.calculateEmi(principal, annualRate, tenureMonths);
        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);
        BigDecimal remaining = principal;
        for (int i = 1; i <= tenureMonths; i++) {
            BigDecimal interest = remaining.multiply(monthlyRate).setScale(HlmsConstants.MONETARY_SCALE, HlmsConstants.ROUNDING_MODE);
            BigDecimal principalComp = emi.subtract(interest).setScale(HlmsConstants.MONETARY_SCALE, HlmsConstants.ROUNDING_MODE);
            if (i == tenureMonths) { principalComp = remaining; remaining = BigDecimal.ZERO; } else { remaining = remaining.subtract(principalComp); }
            schedule.add(RepaymentSchedule.builder().loanAccountId(loanAccountId).emiNumber(i).dueDate(firstEmiDate.plusMonths(i - 1)).emiAmount(emi).principalComponent(principalComp).interestComponent(interest).closingBalance(remaining).build());
        }
        return schedule;
    }
}
