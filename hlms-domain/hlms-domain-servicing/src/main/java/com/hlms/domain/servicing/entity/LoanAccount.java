package com.hlms.domain.servicing.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.LoanStatus;
import com.hlms.common.util.enums.RateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Core loan account entity representing an active loan in the servicing phase.
 * Tracks balances, rates, EMI details, and payment history.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanAccount extends BaseEntity {

    private String accountNumber;
    private Long applicationId;
    private Long customerId;
    private Long branchId;
    private Long productId;
    private BigDecimal sanctionedAmount;
    private BigDecimal disbursedAmount;
    private BigDecimal outstandingPrincipal;
    private BigDecimal outstandingInterest;
    private BigDecimal currentInterestRate;
    private RateType rateType;
    private String benchmarkName; // EBLR, RLLR
    private BigDecimal benchmarkValue;
    private BigDecimal spread;
    private BigDecimal emiAmount;
    private Integer tenure; // total months
    private Integer remainingTenure;
    private Integer completedTenure;
    private LocalDate firstEmiDate;
    private LocalDate lastEmiDate;
    private LocalDate maturityDate;
    private Integer emiDay; // 5, 10, or 15
    private LocalDate nextRateResetDate;
    private LoanStatus status;
    private Integer dpd; // Days Past Due
    private boolean fullyDisbursed;
    private BigDecimal preEmiInterestAccumulated;
    private BigDecimal totalInterestPaid;
    private BigDecimal totalPrincipalPaid;
    private BigDecimal totalChargesPaid;
    private LocalDate lastPaymentDate;
    private BigDecimal lastPaymentAmount;

    /**
     * Calculate total outstanding amount (principal + interest).
     *
     * @return total outstanding amount
     */
    public BigDecimal getTotalOutstanding() {
        return outstandingPrincipal.add(outstandingInterest != null ? outstandingInterest : BigDecimal.ZERO);
    }

    /**
     * Check if the loan is classified as NPA (90+ DPD as per IRAC norms).
     *
     * @return true if DPD is 90 or more
     */
    public boolean isNpa() {
        return dpd != null && dpd >= 90;
    }
}