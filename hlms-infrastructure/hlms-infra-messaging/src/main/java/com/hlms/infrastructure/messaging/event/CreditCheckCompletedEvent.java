package com.hlms.infrastructure.messaging.event;

import java.time.LocalDateTime;

public record CreditCheckCompletedEvent(
    Long applicationId,
    int cibilScore,
    boolean passed,
    LocalDateTime timestamp
) {}
