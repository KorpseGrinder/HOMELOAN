package com.hlms.domain.servicing.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.PaymentMode;
import com.hlms.common.util.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Records every financial transaction on a loan account.
 * Supports disbursements, EMI payments, prepayments, charges, and reversals.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanTransaction extends BaseEntity {

    private Long loanAccountId;
    private TransactionType transactionType;
    private LocalDate transactionDate;
    private LocalDateTime transactionTimestamp;
    private BigDecimal amount;
    private BigDecimal principalComponent;
    private BigDecimal interestComponent;
    private BigDecimal chargesComponent;
    private BigDecimal balanceAfter;
    private PaymentMode paymentMode;
    private String referenceNumber;
    private String utrNumber;
    private String remarks;
    private boolean reversed;
    private Long reversalTransactionId;
}