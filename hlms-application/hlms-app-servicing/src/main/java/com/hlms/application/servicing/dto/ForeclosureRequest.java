package com.hlms.application.servicing.dto;
import jakarta.validation.constraints.NotNull;
public record ForeclosureRequest(@NotNull Long loanAccountId, String remarks) {}
