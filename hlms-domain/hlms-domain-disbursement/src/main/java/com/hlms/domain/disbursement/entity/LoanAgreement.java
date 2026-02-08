package com.hlms.domain.disbursement.entity;
import com.hlms.common.util.enums.AgreementStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoanAgreement { private Long id; private Long applicationId; private String agreementNumber; private AgreementStatus status; private BigDecimal sanctionedAmount; private BigDecimal interestRate; private Integer tenureMonths; private LocalDate agreementDate; private String stampDutyReference; private String esignReference; private LocalDate esignDate; }
