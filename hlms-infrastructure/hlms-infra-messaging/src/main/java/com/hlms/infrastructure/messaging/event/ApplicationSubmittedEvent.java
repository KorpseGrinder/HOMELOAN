package com.hlms.infrastructure.messaging.event;

import java.time.LocalDateTime;

public record ApplicationSubmittedEvent(
    Long applicationId,
    String applicationNumber,
    Long customerId,
    LocalDateTime timestamp
) {}
