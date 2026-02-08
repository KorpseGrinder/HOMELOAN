package com.hlms.domain.servicing.entity;

import com.hlms.common.util.base.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Daily interest accrual record for reducing balance method.
 * Used by batch jobs for interest computation and month-end processing.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterestAccrual extends BaseEntity {

    private Long loanAccountId;
    private LocalDate accrualDate;
    private BigDecimal outstandingPrincipal;
    private BigDecimal interestRate;
    private BigDecimal dailyInterest;
    private BigDecimal cumulativeMonthlyInterest;
    private Integer dayOfMonth;
    private boolean monthEndProcessed;
}