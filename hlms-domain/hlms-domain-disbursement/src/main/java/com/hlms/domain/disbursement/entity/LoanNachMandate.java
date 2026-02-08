package com.hlms.domain.disbursement.entity;
import com.hlms.common.util.enums.NachMandateStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoanNachMandate { private Long id; private Long applicationId; private NachMandateStatus status; private String umrn; private String customerBankAccountNumber; private String customerBankIfsc; private BigDecimal mandateAmount; private LocalDate startDate; private LocalDate endDate; private Integer debitDay; private String frequency; }
