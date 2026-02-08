package com.hlms.application.disbursement.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
public record DisbursementResponse(Long disbursementId, Long applicationId, String status, BigDecimal amount, String utrNumber, LocalDate disbursementDate) {}
