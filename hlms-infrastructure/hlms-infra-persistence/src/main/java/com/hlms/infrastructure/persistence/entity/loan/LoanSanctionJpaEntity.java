package com.hlms.infrastructure.persistence.entity.loan;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_SANCTION")
public class LoanSanctionJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_loan_sanc") @SequenceGenerator(name = "seq_loan_sanc", sequenceName = "SEQ_LOAN_SANCTION_ID", allocationSize = 1) @Column(name = "SANCTION_ID") private Long id;
    @Column(name = "APPLICATION_ID", nullable = false) private Long applicationId;
    @Column(name = "SANCTION_LETTER_NUMBER", unique = true) private String sanctionLetterNumber;
    @Column(name = "SANCTIONED_AMOUNT", precision = 15, scale = 2) private BigDecimal sanctionedAmount;
    @Column(name = "SANCTIONED_TENURE_MONTHS") private Integer sanctionedTenureMonths;
    @Column(name = "INTEREST_RATE", precision = 7, scale = 4) private BigDecimal interestRate;
    @Column(name = "RATE_TYPE") private String rateType;
    @Column(name = "EMI_AMOUNT", precision = 15, scale = 2) private BigDecimal emiAmount;
    @Column(name = "PROCESSING_FEE", precision = 15, scale = 2) private BigDecimal processingFee;
    @Column(name = "SANCTION_DATE") private LocalDate sanctionDate;
    @Column(name = "VALIDITY_DATE") private LocalDate validityDate;
    @Column(name = "CONDITIONS", length = 2000) private String conditions;
    @Column(name = "SANCTIONED_BY") private String sanctionedBy;
    @Column(name = "SANCTION_LETTER_PATH") private String sanctionLetterPath;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
