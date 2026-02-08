package com.hlms.domain.collection.service;

import com.hlms.common.util.enums.NpaCategory;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class ProvisioningCalculator {

    public BigDecimal calculateProvisionPercentage(NpaCategory category) {
        if (category == null) {
            return new BigDecimal("0.40");
        }
        return switch (category) {
            case STANDARD -> new BigDecimal("0.40");
            case SUBSTANDARD -> new BigDecimal("15.00");
            case DOUBTFUL_1 -> new BigDecimal("25.00");
            case DOUBTFUL_2 -> new BigDecimal("40.00");
            case DOUBTFUL_3 -> new BigDecimal("100.00");
            case LOSS -> new BigDecimal("100.00");
        };
    }

    public BigDecimal calculateProvisionAmount(BigDecimal outstanding, NpaCategory category) {
        return outstanding.multiply(calculateProvisionPercentage(category))
            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
}
