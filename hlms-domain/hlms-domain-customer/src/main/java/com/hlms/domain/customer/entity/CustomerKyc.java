package com.hlms.domain.customer.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.DocumentType;
import com.hlms.common.util.enums.KycStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CustomerKyc extends BaseEntity {

    private Long customerId;
    private DocumentType documentType;
    private String documentNumber;
    private String documentPath;
    private KycStatus verificationStatus;
    private String verifiedBy;
    private LocalDateTime verifiedDate;
    private LocalDate expiryDate;
    private String remarks;
}
