package com.hlms.infrastructure.persistence.entity.collection;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "COLLECTION_CASE")
public class CollectionCaseJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_coll_case") @SequenceGenerator(name = "seq_coll_case", sequenceName = "SEQ_COLLECTION_CASE_ID", allocationSize = 1) @Column(name = "CASE_ID") private Long id;
    @Column(name = "ACCOUNT_ID", nullable = false) private Long accountId;
    @Column(name = "CASE_STATUS") private String caseStatus;
    @Column(name = "COLLECTION_BUCKET") private String collectionBucket;
    @Column(name = "DPD") private Integer dpd;
    @Column(name = "OVERDUE_AMOUNT", precision = 15, scale = 2) private BigDecimal overdueAmount;
    @Column(name = "TOTAL_OUTSTANDING", precision = 15, scale = 2) private BigDecimal totalOutstanding;
    @Column(name = "ASSIGNED_TO") private String assignedTo;
    @Column(name = "ASSIGNED_DATE") private LocalDate assignedDate;
    @Column(name = "PRIORITY") private String priority;
    @Column(name = "RESOLUTION_DATE") private LocalDate resolutionDate;
    @Column(name = "RESOLUTION_REMARKS", length = 2000) private String resolutionRemarks;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
