package com.hlms.application.origination.dto;
import java.time.LocalDateTime;
public record CreateLeadResponse(Long applicationId, String applicationNumber, String status, LocalDateTime createdDate) {}
