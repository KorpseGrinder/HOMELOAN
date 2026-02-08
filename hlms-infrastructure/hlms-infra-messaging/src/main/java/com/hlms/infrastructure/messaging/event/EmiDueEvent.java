package com.hlms.infrastructure.messaging.event;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EmiDueEvent(
    Long loanAccountId,
    String loanAccountNumber,
    Long customerId,
    BigDecimal emiAmount,
    LocalDate dueDate,
    LocalDateTime timestamp
) {}
