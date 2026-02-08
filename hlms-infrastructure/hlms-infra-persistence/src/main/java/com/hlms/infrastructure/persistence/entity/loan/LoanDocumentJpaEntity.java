package com.hlms.infrastructure.persistence.entity.loan;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "LOAN_DOCUMENT")
public class LoanDocumentJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_loan_doc") @SequenceGenerator(name = "seq_loan_doc", sequenceName = "SEQ_LOAN_DOCUMENT_ID", allocationSize = 1) @Column(name = "DOCUMENT_ID") private Long id;
    @Column(name = "APPLICATION_ID", nullable = false) private Long applicationId;
    @Column(name = "DOCUMENT_TYPE") private String documentType;
    @Column(name = "DOCUMENT_STATUS") private String documentStatus;
    @Column(name = "FILE_NAME") private String fileName;
    @Column(name = "FILE_PATH") private String filePath;
    @Column(name = "CONTENT_TYPE") private String contentType;
    @Column(name = "FILE_SIZE") private Long fileSize;
    @Column(name = "UPLOADED_BY") private String uploadedBy;
    @Column(name = "UPLOADED_DATE") private LocalDateTime uploadedDate;
    @Column(name = "VERIFIED_BY") private String verifiedBy;
    @Column(name = "VERIFIED_DATE") private LocalDateTime verifiedDate;
    @Column(name = "REJECTION_REASON") private String rejectionReason;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
