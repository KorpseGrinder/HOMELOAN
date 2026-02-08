package com.hlms.infrastructure.persistence.entity.loan;
import com.hlms.common.util.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_APPLICATION")
public class LoanApplicationJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_loan_app") @SequenceGenerator(name = "seq_loan_app", sequenceName = "SEQ_LOAN_APPLICATION_ID", allocationSize = 1) @Column(name = "APPLICATION_ID") private Long id;
    @Column(name = "APPLICATION_NUMBER", unique = true, nullable = false) private String applicationNumber;
    @Column(name = "CUSTOMER_ID", nullable = false) private Long customerId;
    @Column(name = "PRODUCT_ID") private Long productId;
    @Enumerated(EnumType.STRING) @Column(name = "APPLICATION_STATUS", nullable = false) private ApplicationStatus applicationStatus;
    @Enumerated(EnumType.STRING) @Column(name = "LOAN_STATUS") private LoanStatus loanStatus;
    @Enumerated(EnumType.STRING) @Column(name = "PURPOSE") private LoanPurpose purpose;
    @Enumerated(EnumType.STRING) @Column(name = "CHANNEL") private Channel channel;
    @Column(name = "REQUESTED_AMOUNT", precision = 15, scale = 2) private BigDecimal requestedAmount;
    @Column(name = "REQUESTED_TENURE_MONTHS") private Integer requestedTenureMonths;
    @Column(name = "SANCTIONED_AMOUNT", precision = 15, scale = 2) private BigDecimal sanctionedAmount;
    @Column(name = "SANCTIONED_INTEREST_RATE", precision = 7, scale = 4) private BigDecimal sanctionedInterestRate;
    @Column(name = "SANCTIONED_TENURE_MONTHS") private Integer sanctionedTenureMonths;
    @Column(name = "ASSIGNED_TO") private String assignedTo;
    @Column(name = "BRANCH_CODE") private String branchCode;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
