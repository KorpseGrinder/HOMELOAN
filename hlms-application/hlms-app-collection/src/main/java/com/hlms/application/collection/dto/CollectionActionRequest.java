package com.hlms.application.collection.dto;
import com.hlms.common.util.enums.CollectionActionType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
public record CollectionActionRequest(@NotNull Long caseId, @NotNull CollectionActionType actionType, String description, String outcome, LocalDateTime nextFollowUpDate) {}
