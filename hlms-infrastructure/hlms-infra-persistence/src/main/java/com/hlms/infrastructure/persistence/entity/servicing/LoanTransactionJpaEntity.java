package com.hlms.infrastructure.persistence.entity.servicing;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_TRANSACTION")
public class LoanTransactionJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_loan_txn") @SequenceGenerator(name = "seq_loan_txn", sequenceName = "SEQ_LOAN_TRANSACTION_ID", allocationSize = 1) @Column(name = "TRANSACTION_ID") private Long id;
    @Column(name = "ACCOUNT_ID", nullable = false) private Long accountId;
    @Column(name = "TRANSACTION_TYPE") private String transactionType;
    @Column(name = "TRANSACTION_DATE", nullable = false) private LocalDate transactionDate;
    @Column(name = "AMOUNT", precision = 15, scale = 2, nullable = false) private BigDecimal amount;
    @Column(name = "PRINCIPAL_COMPONENT", precision = 15, scale = 2) private BigDecimal principalComponent;
    @Column(name = "INTEREST_COMPONENT", precision = 15, scale = 2) private BigDecimal interestComponent;
    @Column(name = "PENALTY_COMPONENT", precision = 15, scale = 2) private BigDecimal penaltyComponent;
    @Column(name = "BALANCE_AFTER", precision = 15, scale = 2) private BigDecimal balanceAfter;
    @Column(name = "PAYMENT_MODE") private String paymentMode;
    @Column(name = "REFERENCE_NUMBER") private String referenceNumber;
    @Column(name = "NARRATION", length = 500) private String narration;
    @Column(name = "REVERSAL_OF") private Long reversalOf;
    @Column(name = "IS_REVERSED") private Boolean isReversed;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
