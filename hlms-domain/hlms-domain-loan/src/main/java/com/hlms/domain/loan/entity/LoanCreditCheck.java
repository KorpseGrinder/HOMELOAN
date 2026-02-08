package com.hlms.domain.loan.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.CreditBureau;
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
public class LoanCreditCheck extends BaseEntity {

    private Long applicationId;
    private CreditBureau bureau;
    private Integer score;
    private String reportReference;
    private String reportSummary;
    private Integer activeLoans;
    private BigDecimal totalOutstanding;
    private BigDecimal totalEmiAmount;
    private Integer defaultsCount;
    private Integer settlementsCount;
    private LocalDateTime consentDate;
    private LocalDateTime checkDate;
    private boolean passed;
}
