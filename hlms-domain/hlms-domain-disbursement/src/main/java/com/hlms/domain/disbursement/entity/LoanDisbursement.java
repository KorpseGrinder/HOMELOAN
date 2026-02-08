package com.hlms.domain.disbursement.entity;
import com.hlms.common.util.enums.DisbursementStatus;
import com.hlms.common.util.enums.DisbursementType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoanDisbursement { private Long id; private Long applicationId; private DisbursementType disbursementType; private DisbursementStatus status; private Integer trancheNumber; private BigDecimal disbursementAmount; private String beneficiaryName; private String beneficiaryAccountNumber; private String beneficiaryIfscCode; private String utrNumber; private LocalDate disbursementDate; private LocalDate valueDate; private String approvedBy; private String remarks; private boolean balanceTransfer; private String btBankName; private String btLoanAccountNumber; private BigDecimal btOutstandingAmount; }
