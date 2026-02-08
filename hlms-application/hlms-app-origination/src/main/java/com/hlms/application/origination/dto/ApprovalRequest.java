package com.hlms.application.origination.dto;
import com.hlms.common.util.enums.ApprovalAction;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
public record ApprovalRequest(@NotNull ApprovalAction action, String remarks, BigDecimal sanctionedAmount, BigDecimal sanctionedInterestRate, Integer sanctionedTenureMonths) {}
