package com.hlms.application.collection.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
public record CollectionCaseResponse(Long caseId, Long loanAccountId, String bucket, String status, Integer dpd, BigDecimal totalOverdueAmount, String assignedTo, LocalDate nextFollowUpDate) {}
