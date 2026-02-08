package com.hlms.application.servicing.dto;
import java.math.BigDecimal;
public record ForeclosureResponse(Long loanAccountId, BigDecimal outstandingPrincipal, BigDecimal accruedInterest, BigDecimal prepaymentCharges, BigDecimal penalty, BigDecimal totalForeclosureAmount) {}
