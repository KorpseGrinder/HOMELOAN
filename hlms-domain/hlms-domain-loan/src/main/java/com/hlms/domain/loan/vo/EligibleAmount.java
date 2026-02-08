package com.hlms.domain.loan.vo;
import java.math.BigDecimal;
public record EligibleAmount(BigDecimal eligibleLoanAmount, BigDecimal maxEmi, BigDecimal interestRate, int tenureMonths) {}
