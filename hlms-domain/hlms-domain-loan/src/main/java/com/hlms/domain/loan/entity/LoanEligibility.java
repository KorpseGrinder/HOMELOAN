package com.hlms.domain.loan.entity;

import com.hlms.common.util.base.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LoanEligibility extends BaseEntity {

    private Long applicationId;
    private BigDecimal grossMonthlyIncome;
    private BigDecimal netMonthlyIncome;
    private BigDecimal clubbedIncome;
    private BigDecimal existingEmiAmount;
    private BigDecimal proposedEmiAmount;
    private BigDecimal foir;
    private BigDecimal maxFoirAllowed;
    private BigDecimal eligibleAmount;
    private BigDecimal requestedAmount;
    private BigDecimal propertyValue;
    private BigDecimal ltv;
    private BigDecimal maxLtvAllowed;
    private String riskScore;
    private String riskCategory;
    private LocalDateTime calculatedDate;
    private boolean eligible;
    private String ineligibilityReason;
}
