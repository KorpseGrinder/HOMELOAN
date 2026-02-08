package com.hlms.domain.servicing.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.EmiStatus;
import com.hlms.common.util.enums.PaymentMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Tracks individual EMI due records including payment status,
 * NACH presentment details, and penalty/bounce charges.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmiDue extends BaseEntity {

    private Long loanAccountId;
    private Integer emiNumber;
    private LocalDate dueDate;
    private BigDecimal emiAmount;
    private BigDecimal principalComponent;
    private BigDecimal interestComponent;
    private BigDecimal paidAmount;
    private LocalDate paidDate;
    private PaymentMode paymentMode;
    private String paymentReference;
    private EmiStatus status;
    private Integer dpd;
    private BigDecimal penalInterest;
    private BigDecimal bounceCharges;
    private String nachPresentmentRef;
    private String nachResponseStatus;
}