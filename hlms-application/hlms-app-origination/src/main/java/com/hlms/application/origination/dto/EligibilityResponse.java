package com.hlms.application.origination.dto;
import java.math.BigDecimal;
public record EligibilityResponse(boolean eligible, BigDecimal eligibleAmount, BigDecimal maxEmi, BigDecimal foirRatio, BigDecimal ltvRatio, int cibilScore, String remarks) {}
