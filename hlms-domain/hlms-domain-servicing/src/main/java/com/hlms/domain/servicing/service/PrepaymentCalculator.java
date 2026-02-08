package com.hlms.domain.servicing.service;

import com.hlms.common.util.constants.HlmsConstants;
import com.hlms.common.util.enums.RateType;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class PrepaymentCalculator {
    public BigDecimal calculatePrepaymentCharges(BigDecimal amount, RateType rateType, BigDecimal chargePercentage) {
        if (rateType == RateType.FLOATING) return BigDecimal.ZERO;
        return amount.multiply(chargePercentage).divide(BigDecimal.valueOf(100), HlmsConstants.MONETARY_SCALE, RoundingMode.HALF_UP);
    }
    public BigDecimal calculateForeclosureAmount(BigDecimal outstandingPrincipal, BigDecimal accruedInterest, BigDecimal penalty, BigDecimal prepaymentCharges) {
        return outstandingPrincipal.add(accruedInterest).add(penalty).add(prepaymentCharges).setScale(HlmsConstants.MONETARY_SCALE, HlmsConstants.ROUNDING_MODE);
    }
}
