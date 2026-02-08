package com.hlms.application.servicing.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
public record RepaymentScheduleResponse(Integer installmentNumber, LocalDate dueDate, BigDecimal emiAmount, BigDecimal principalComponent, BigDecimal interestComponent, BigDecimal closingBalance, String status) {}
