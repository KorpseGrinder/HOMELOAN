package com.hlms.infrastructure.persistence.entity.disbursement;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_NACH_MANDATE")
public class LoanNachMandateJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_nach") @SequenceGenerator(name = "seq_nach", sequenceName = "SEQ_LOAN_NACH_MANDATE_ID", allocationSize = 1) @Column(name = "NACH_ID") private Long id;
    @Column(name = "APPLICATION_ID", nullable = false) private Long applicationId;
    @Column(name = "MANDATE_STATUS") private String mandateStatus;
    @Column(name = "UMRN") private String umrn;
    @Column(name = "BANK_ACCOUNT_ID") private String bankAccountId;
    @Column(name = "MAX_AMOUNT", precision = 15, scale = 2) private BigDecimal maxAmount;
    @Column(name = "START_DATE") private LocalDate startDate;
    @Column(name = "END_DATE") private LocalDate endDate;
    @Column(name = "FREQUENCY") private String frequency;
    @Column(name = "REGISTRATION_DATE") private LocalDate registrationDate;
    @Column(name = "REJECTION_REASON") private String rejectionReason;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
