package com.hlms.infrastructure.messaging.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record NpaClassifiedEvent(
    Long loanAccountId,
    String npaCategory,
    int dpd,
    BigDecimal outstandingAmount,
    BigDecimal provisionAmount,
    LocalDateTime timestamp
) {}
