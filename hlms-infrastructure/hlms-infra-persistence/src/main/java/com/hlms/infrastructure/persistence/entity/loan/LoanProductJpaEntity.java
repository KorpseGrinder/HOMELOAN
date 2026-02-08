package com.hlms.infrastructure.persistence.entity.loan;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_PRODUCT")
public class LoanProductJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_loan_prod") @SequenceGenerator(name = "seq_loan_prod", sequenceName = "SEQ_LOAN_PRODUCT_ID", allocationSize = 1) @Column(name = "PRODUCT_ID") private Long id;
    @Column(name = "PRODUCT_CODE", unique = true, nullable = false) private String productCode;
    @Column(name = "PRODUCT_NAME", nullable = false) private String productName;
    @Column(name = "PRODUCT_TYPE") private String productType;
    @Column(name = "MIN_LOAN_AMOUNT", precision = 15, scale = 2) private BigDecimal minLoanAmount;
    @Column(name = "MAX_LOAN_AMOUNT", precision = 15, scale = 2) private BigDecimal maxLoanAmount;
    @Column(name = "MIN_TENURE_MONTHS") private Integer minTenureMonths;
    @Column(name = "MAX_TENURE_MONTHS") private Integer maxTenureMonths;
    @Column(name = "BASE_INTEREST_RATE", precision = 7, scale = 4) private BigDecimal baseInterestRate;
    @Column(name = "PROCESSING_FEE_PERCENT", precision = 5, scale = 2) private BigDecimal processingFeePercent;
    @Column(name = "MAX_LTV_RATIO", precision = 5, scale = 2) private BigDecimal maxLtvRatio;
    @Column(name = "MAX_FOIR", precision = 5, scale = 2) private BigDecimal maxFoir;
    @Column(name = "MIN_CIBIL_SCORE") private Integer minCibilScore;
    @Column(name = "IS_ACTIVE") private Boolean isActive;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
