package com.hlms.infrastructure.persistence.entity.servicing;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "REPAYMENT_SCHEDULE")
public class RepaymentScheduleJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_repay_sch") @SequenceGenerator(name = "seq_repay_sch", sequenceName = "SEQ_REPAYMENT_SCHEDULE_ID", allocationSize = 1) @Column(name = "SCHEDULE_ID") private Long id;
    @Column(name = "ACCOUNT_ID", nullable = false) private Long accountId;
    @Column(name = "INSTALLMENT_NUMBER", nullable = false) private Integer installmentNumber;
    @Column(name = "DUE_DATE", nullable = false) private LocalDate dueDate;
    @Column(name = "EMI_AMOUNT", precision = 15, scale = 2) private BigDecimal emiAmount;
    @Column(name = "PRINCIPAL_COMPONENT", precision = 15, scale = 2) private BigDecimal principalComponent;
    @Column(name = "INTEREST_COMPONENT", precision = 15, scale = 2) private BigDecimal interestComponent;
    @Column(name = "OPENING_BALANCE", precision = 15, scale = 2) private BigDecimal openingBalance;
    @Column(name = "CLOSING_BALANCE", precision = 15, scale = 2) private BigDecimal closingBalance;
    @Column(name = "SCHEDULE_STATUS") private String scheduleStatus;
    @Column(name = "PAID_AMOUNT", precision = 15, scale = 2) private BigDecimal paidAmount;
    @Column(name = "PAID_DATE") private LocalDate paidDate;
    @Column(name = "PENALTY_AMOUNT", precision = 15, scale = 2) private BigDecimal penaltyAmount;
    @Column(name = "WAIVER_AMOUNT", precision = 15, scale = 2) private BigDecimal waiverAmount;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
