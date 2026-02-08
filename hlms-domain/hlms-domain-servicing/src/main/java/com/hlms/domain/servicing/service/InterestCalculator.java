package com.hlms.domain.servicing.service;

import com.hlms.common.util.constants.HlmsConstants;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class InterestCalculator {
    public BigDecimal calculateDailyInterest(BigDecimal outstandingPrincipal, BigDecimal annualRate) {
        BigDecimal dailyRate = annualRate.divide(BigDecimal.valueOf(HlmsConstants.DAYS_IN_YEAR * 100L), 10, RoundingMode.HALF_UP);
        return outstandingPrincipal.multiply(dailyRate).setScale(HlmsConstants.MONETARY_SCALE, HlmsConstants.ROUNDING_MODE);
    }
    public BigDecimal calculateMonthlyInterest(BigDecimal outstandingPrincipal, BigDecimal annualRate, int daysInMonth) {
        return calculateDailyInterest(outstandingPrincipal, annualRate).multiply(BigDecimal.valueOf(daysInMonth)).setScale(HlmsConstants.MONETARY_SCALE, HlmsConstants.ROUNDING_MODE);
    }
}
