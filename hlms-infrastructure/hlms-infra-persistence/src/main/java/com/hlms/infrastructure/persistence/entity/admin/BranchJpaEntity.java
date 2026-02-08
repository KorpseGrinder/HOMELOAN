package com.hlms.infrastructure.persistence.entity.admin;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "BRANCH")
public class BranchJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_branch") @SequenceGenerator(name = "seq_branch", sequenceName = "SEQ_BRANCH_ID", allocationSize = 1) @Column(name = "BRANCH_ID") private Long id;
    @Column(name = "BRANCH_CODE", unique = true, nullable = false) private String branchCode;
    @Column(name = "BRANCH_NAME", nullable = false) private String branchName;
    @Column(name = "BRANCH_TYPE") private String branchType;
    @Column(name = "REGION") private String region;
    @Column(name = "ZONE") private String zone;
    @Column(name = "ADDRESS") private String address;
    @Column(name = "CITY") private String city;
    @Column(name = "STATE") private String state;
    @Column(name = "PIN_CODE") private String pinCode;
    @Column(name = "PHONE") private String phone;
    @Column(name = "EMAIL") private String email;
    @Column(name = "BRANCH_HEAD_ID") private Long branchHeadId;
    @Column(name = "IS_ACTIVE") private Boolean isActive;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
