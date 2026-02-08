package com.hlms.domain.disbursement.vo;
import java.time.LocalDateTime;
public record FundTransferResult(boolean success, String utrNumber, String errorMessage, LocalDateTime transactionTime) {}
