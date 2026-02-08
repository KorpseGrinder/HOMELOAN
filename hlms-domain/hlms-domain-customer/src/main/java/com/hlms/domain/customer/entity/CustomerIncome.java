package com.hlms.domain.customer.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.IncomeSource;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CustomerIncome extends BaseEntity {

    private Long customerId;
    private IncomeSource incomeSource;
    private BigDecimal grossMonthlyIncome;
    private BigDecimal netMonthlyIncome;
    private BigDecimal annualIncome;
    private String incomeDocumentType;
    private boolean verified;
    private String remarks;
}
