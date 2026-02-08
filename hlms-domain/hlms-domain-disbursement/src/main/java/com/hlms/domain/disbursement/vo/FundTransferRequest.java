package com.hlms.domain.disbursement.vo;
import java.math.BigDecimal;
public record FundTransferRequest(String beneficiaryName, String beneficiaryAccountNumber, String beneficiaryIfscCode, BigDecimal amount, String purpose, String referenceNumber) {}
