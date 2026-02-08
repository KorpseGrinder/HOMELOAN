package com.hlms.domain.loan.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.RateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LoanSanction extends BaseEntity {

    private Long applicationId;
    private BigDecimal sanctionedAmount;
    private BigDecimal interestRate;
    private RateType rateType;
    private String benchmarkRate;
    private BigDecimal spread;
    private Integer tenure;
    private BigDecimal processingFee;
    private BigDecimal processingFeePercentage;
    private LocalDate validityDate;
    private String conditions;
    private String sanctionLetterPath;
    private LocalDateTime sanctionDate;
    private String sanctionedBy;
}
