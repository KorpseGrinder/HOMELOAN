package com.hlms.infrastructure.persistence.entity.loan;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "CO_APPLICANT")
public class CoApplicantJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_co_app") @SequenceGenerator(name = "seq_co_app", sequenceName = "SEQ_CO_APPLICANT_ID", allocationSize = 1) @Column(name = "CO_APPLICANT_ID") private Long id;
    @Column(name = "APPLICATION_ID", nullable = false) private Long applicationId;
    @Column(name = "CUSTOMER_ID", nullable = false) private Long customerId;
    @Column(name = "CO_APPLICANT_TYPE") private String coApplicantType;
    @Column(name = "RELATIONSHIP_TYPE") private String relationshipType;
    @Column(name = "INCOME_CONSIDERED", precision = 15, scale = 2) private BigDecimal incomeConsidered;
    @Column(name = "INCOME_WEIGHTAGE", precision = 5, scale = 2) private BigDecimal incomeWeightage;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
