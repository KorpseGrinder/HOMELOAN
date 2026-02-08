package com.hlms.infrastructure.persistence.entity.customer;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "CUSTOMER_KYC")
public class CustomerKycJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_cust_kyc") @SequenceGenerator(name = "seq_cust_kyc", sequenceName = "SEQ_CUSTOMER_KYC_ID", allocationSize = 1) @Column(name = "KYC_ID") private Long id;
    @Column(name = "CUSTOMER_ID", nullable = false) private Long customerId;
    @Column(name = "KYC_TYPE") private String kycType;
    @Column(name = "DOCUMENT_NUMBER") private String documentNumber;
    @Column(name = "DOCUMENT_FILE_PATH") private String documentFilePath;
    @Column(name = "EXPIRY_DATE") private LocalDate expiryDate;
    @Column(name = "VERIFICATION_STATUS") private String verificationStatus;
    @Column(name = "VERIFIED_BY") private String verifiedBy;
    @Column(name = "VERIFIED_DATE") private LocalDateTime verifiedDate;
    @Column(name = "REMARKS") private String remarks;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
