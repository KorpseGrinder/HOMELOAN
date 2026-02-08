package com.hlms.infrastructure.persistence.entity.servicing;
import com.hlms.common.util.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_ACCOUNT")
public class LoanAccountJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_acct") @SequenceGenerator(name = "seq_acct", sequenceName = "SEQ_LOAN_ACCOUNT_ID", allocationSize = 1) @Column(name = "LOAN_ACCOUNT_ID") private Long id;
    @Column(name = "LOAN_ACCOUNT_NUMBER", unique = true, nullable = false) private String loanAccountNumber;
    @Column(name = "APPLICATION_ID", nullable = false) private Long applicationId;
    @Column(name = "CUSTOMER_ID", nullable = false) private Long customerId;
    @Enumerated(EnumType.STRING) @Column(name = "STATUS", nullable = false) private LoanStatus status;
    @Column(name = "SANCTIONED_AMOUNT", precision = 15, scale = 2) private BigDecimal sanctionedAmount;
    @Column(name = "DISBURSED_AMOUNT", precision = 15, scale = 2) private BigDecimal disbursedAmount;
    @Column(name = "OUTSTANDING_PRINCIPAL", precision = 15, scale = 2) private BigDecimal outstandingPrincipal;
    @Column(name = "OUTSTANDING_INTEREST", precision = 15, scale = 2) private BigDecimal outstandingInterest;
    @Enumerated(EnumType.STRING) @Column(name = "RATE_TYPE") private RateType rateType;
    @Column(name = "INTEREST_RATE", precision = 7, scale = 4) private BigDecimal interestRate;
    @Column(name = "TENURE_MONTHS") private Integer tenureMonths;
    @Column(name = "EMI_AMOUNT", precision = 15, scale = 2) private BigDecimal emiAmount;
    @Column(name = "FIRST_EMI_DATE") private LocalDate firstEmiDate;
    @Column(name = "DPD") private Integer dpd;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
}
