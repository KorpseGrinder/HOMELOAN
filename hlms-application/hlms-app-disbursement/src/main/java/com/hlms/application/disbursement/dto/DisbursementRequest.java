package com.hlms.application.disbursement.dto;
import com.hlms.common.util.enums.DisbursementType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record DisbursementRequest(@NotNull Long applicationId, @NotNull DisbursementType disbursementType, @NotNull BigDecimal amount, @NotBlank String beneficiaryName, @NotBlank String beneficiaryAccountNumber, @NotBlank String beneficiaryIfscCode, Integer trancheNumber, String remarks, boolean balanceTransfer, String btBankName, String btLoanAccountNumber, BigDecimal btOutstandingAmount) {}
