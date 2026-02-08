package com.hlms.application.servicing.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record PrepaymentRequest(@NotNull Long loanAccountId, @NotNull @DecimalMin("1") BigDecimal amount, boolean reduceEmi, String remarks) {}
