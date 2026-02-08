package com.hlms.domain.servicing.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.ScheduleStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Represents a single installment in the amortization/repayment schedule.
 * Each entry corresponds to one EMI due date with principal and interest breakdown.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RepaymentSchedule extends BaseEntity {

    private Long loanAccountId;
    private Integer emiNumber;
    private LocalDate dueDate;
    private BigDecimal openingBalance;
    private BigDecimal principalComponent;
    private BigDecimal interestComponent;
    private BigDecimal emiAmount;
    private BigDecimal closingBalance;
    private ScheduleStatus status;
    private Integer scheduleVersion;
}