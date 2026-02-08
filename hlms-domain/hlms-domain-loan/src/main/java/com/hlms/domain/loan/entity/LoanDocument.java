package com.hlms.domain.loan.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.DocumentStatus;
import com.hlms.common.util.enums.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LoanDocument extends BaseEntity {

    private Long applicationId;
    private DocumentType documentType;
    private String documentPath;
    private String fileName;
    private String contentType;
    private Long fileSize;
    private DocumentStatus status;
    private String verifiedBy;
    private LocalDateTime verifiedDate;
    private String rejectionReason;
    private String remarks;
}
