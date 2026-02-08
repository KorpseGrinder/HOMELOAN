package com.hlms.domain.loan.vo;
import java.math.BigDecimal;
public record FoirCalculation(BigDecimal grossMonthlyIncome, BigDecimal existingObligations, BigDecimal proposedEmi, BigDecimal foirRatio, boolean eligible) {}
