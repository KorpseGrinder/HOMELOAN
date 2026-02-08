package com.hlms.infrastructure.persistence.entity.disbursement;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_AGREEMENT")
public class LoanAgreementJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_loan_agr") @SequenceGenerator(name = "seq_loan_agr", sequenceName = "SEQ_LOAN_AGREEMENT_ID", allocationSize = 1) @Column(name = "AGREEMENT_ID") private Long id;
    @Column(name = "APPLICATION_ID", nullable = false) private Long applicationId;
    @Column(name = "AGREEMENT_NUMBER", unique = true) private String agreementNumber;
    @Column(name = "AGREEMENT_STATUS") private String agreementStatus;
    @Column(name = "AGREEMENT_DATE") private LocalDate agreementDate;
    @Column(name = "STAMPING_DATE") private LocalDate stampingDate;
    @Column(name = "STAMP_DUTY_AMOUNT", precision = 15, scale = 2) private BigDecimal stampDutyAmount;
    @Column(name = "ESIGN_REFERENCE") private String esignReference;
    @Column(name = "ESIGN_DATE") private LocalDateTime esignDate;
    @Column(name = "AGREEMENT_FILE_PATH") private String agreementFilePath;
    @Column(name = "MOD_REGISTERED") private Boolean modRegistered;
    @Column(name = "MOD_REGISTRATION_DATE") private LocalDate modRegistrationDate;
    @Column(name = "MOD_REGISTRATION_NUMBER") private String modRegistrationNumber;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
