package com.hlms.infrastructure.persistence.entity.loan;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_DEVIATION")
public class LoanDeviationJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_loan_dev") @SequenceGenerator(name = "seq_loan_dev", sequenceName = "SEQ_LOAN_DEVIATION_ID", allocationSize = 1) @Column(name = "DEVIATION_ID") private Long id;
    @Column(name = "APPLICATION_ID", nullable = false) private Long applicationId;
    @Column(name = "DEVIATION_TYPE") private String deviationType;
    @Column(name = "SEVERITY") private String severity;
    @Column(name = "DESCRIPTION", length = 2000) private String description;
    @Column(name = "JUSTIFICATION", length = 2000) private String justification;
    @Column(name = "APPROVED") private Boolean approved;
    @Column(name = "APPROVED_BY") private String approvedBy;
    @Column(name = "APPROVED_DATE") private LocalDateTime approvedDate;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
