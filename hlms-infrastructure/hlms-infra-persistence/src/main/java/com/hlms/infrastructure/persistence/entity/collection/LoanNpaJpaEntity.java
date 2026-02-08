package com.hlms.infrastructure.persistence.entity.collection;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_NPA")
public class LoanNpaJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_loan_npa") @SequenceGenerator(name = "seq_loan_npa", sequenceName = "SEQ_LOAN_NPA_ID", allocationSize = 1) @Column(name = "NPA_ID") private Long id;
    @Column(name = "ACCOUNT_ID", nullable = false) private Long accountId;
    @Column(name = "NPA_DATE") private LocalDate npaDate;
    @Column(name = "NPA_CATEGORY") private String npaCategory;
    @Column(name = "COLLECTION_BUCKET") private String collectionBucket;
    @Column(name = "DPD") private Integer dpd;
    @Column(name = "OUTSTANDING_AMOUNT", precision = 15, scale = 2) private BigDecimal outstandingAmount;
    @Column(name = "PROVISION_PERCENTAGE", precision = 5, scale = 2) private BigDecimal provisionPercentage;
    @Column(name = "PROVISION_AMOUNT", precision = 15, scale = 2) private BigDecimal provisionAmount;
    @Column(name = "IS_UPGRADED") private Boolean isUpgraded;
    @Column(name = "UPGRADE_DATE") private LocalDate upgradeDate;
    @Column(name = "PREVIOUS_CATEGORY") private String previousCategory;
    @Column(name = "CLASSIFICATION_DATE") private LocalDate classificationDate;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
