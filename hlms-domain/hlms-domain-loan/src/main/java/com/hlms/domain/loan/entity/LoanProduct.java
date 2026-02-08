package com.hlms.domain.loan.entity;
import com.hlms.common.util.enums.LoanProductType;
import com.hlms.common.util.enums.RateType;
import lombok.*;
import java.math.BigDecimal;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoanProduct { private Long id; private String productCode; private String productName; private LoanProductType productType; private RateType rateType; private BigDecimal minLoanAmount; private BigDecimal maxLoanAmount; private Integer minTenureMonths; private Integer maxTenureMonths; private BigDecimal minInterestRate; private BigDecimal maxInterestRate; private BigDecimal maxLtvRatio; private BigDecimal processingFeePercentage; private boolean active; }
