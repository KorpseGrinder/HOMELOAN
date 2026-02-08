package com.hlms.infrastructure.persistence.entity.loan;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_CREDIT_CHECK")
public class LoanCreditCheckJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_credit_chk") @SequenceGenerator(name = "seq_credit_chk", sequenceName = "SEQ_LOAN_CREDIT_CHECK_ID", allocationSize = 1) @Column(name = "CREDIT_CHECK_ID") private Long id;
    @Column(name = "APPLICATION_ID", nullable = false) private Long applicationId;
    @Column(name = "CUSTOMER_ID", nullable = false) private Long customerId;
    @Column(name = "CREDIT_BUREAU") private String creditBureau;
    @Column(name = "CREDIT_SCORE") private Integer creditScore;
    @Column(name = "REPORT_DATE") private LocalDate reportDate;
    @Column(name = "REPORT_REFERENCE") private String reportReference;
    @Column(name = "REPORT_FILE_PATH") private String reportFilePath;
    @Column(name = "EXISTING_LOAN_COUNT") private Integer existingLoanCount;
    @Column(name = "EXISTING_EMI_TOTAL", precision = 15, scale = 2) private BigDecimal existingEmiTotal;
    @Column(name = "DELINQUENCY_FLAG") private Boolean delinquencyFlag;
    @Column(name = "DPD_LAST_12_MONTHS") private Integer dpdLast12Months;
    @Column(name = "STATUS") private String status;
    @Column(name = "REMARKS") private String remarks;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
