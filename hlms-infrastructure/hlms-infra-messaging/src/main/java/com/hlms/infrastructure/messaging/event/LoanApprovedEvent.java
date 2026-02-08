package com.hlms.infrastructure.messaging.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LoanApprovedEvent(
    Long applicationId,
    String applicationNumber,
    BigDecimal sanctionedAmount,
    String approvedBy,
    LocalDateTime timestamp
) {}
