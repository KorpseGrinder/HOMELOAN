package com.hlms.infrastructure.messaging.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record DisbursementCompletedEvent(
    Long applicationId,
    Long disbursementId,
    BigDecimal amount,
    String utrNumber,
    LocalDateTime timestamp
) {}
