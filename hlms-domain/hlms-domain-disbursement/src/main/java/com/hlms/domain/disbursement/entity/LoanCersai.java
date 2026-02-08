package com.hlms.domain.disbursement.entity;
import com.hlms.common.util.enums.CersaiStatus;
import lombok.*;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoanCersai { private Long id; private Long applicationId; private Long propertyId; private CersaiStatus status; private String cersaiRegistrationId; private String cersaiTransactionId; private LocalDate registrationDate; private LocalDate modificationDate; private LocalDate satisfactionDate; }
