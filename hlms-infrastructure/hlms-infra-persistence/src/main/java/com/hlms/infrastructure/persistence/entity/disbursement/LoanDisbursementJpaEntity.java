package com.hlms.infrastructure.persistence.entity.disbursement;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_DISBURSEMENT")
public class LoanDisbursementJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_loan_disb") @SequenceGenerator(name = "seq_loan_disb", sequenceName = "SEQ_LOAN_DISBURSEMENT_ID", allocationSize = 1) @Column(name = "DISBURSEMENT_ID") private Long id;
    @Column(name = "APPLICATION_ID", nullable = false) private Long applicationId;
    @Column(name = "DISBURSEMENT_TYPE") private String disbursementType;
    @Column(name = "DISBURSEMENT_STATUS") private String disbursementStatus;
    @Column(name = "TRANCHE_NUMBER") private Integer trancheNumber;
    @Column(name = "DISBURSEMENT_AMOUNT", precision = 15, scale = 2) private BigDecimal disbursementAmount;
    @Column(name = "DISBURSEMENT_DATE") private LocalDate disbursementDate;
    @Column(name = "UTR_NUMBER") private String utrNumber;
    @Column(name = "BENEFICIARY_NAME") private String beneficiaryName;
    @Column(name = "BENEFICIARY_ACCOUNT") private String beneficiaryAccount;
    @Column(name = "BENEFICIARY_IFSC") private String beneficiaryIfsc;
    @Column(name = "BENEFICIARY_BANK") private String beneficiaryBank;
    @Column(name = "IS_BALANCE_TRANSFER") private Boolean isBalanceTransfer;
    @Column(name = "BT_LENDER_NAME") private String btLenderName;
    @Column(name = "BT_LOAN_ACCOUNT") private String btLoanAccount;
    @Column(name = "BT_OUTSTANDING_AMOUNT", precision = 15, scale = 2) private BigDecimal btOutstandingAmount;
    @Column(name = "APPROVED_BY") private String approvedBy;
    @Column(name = "APPROVED_DATE") private LocalDateTime approvedDate;
    @Column(name = "REMARKS", length = 2000) private String remarks;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
