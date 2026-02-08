package com.hlms.application.origination.dto;
import com.hlms.common.util.enums.Channel;
import com.hlms.common.util.enums.LoanPurpose;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record CreateLeadRequest(@NotBlank String firstName, @NotBlank String lastName, @NotBlank String mobileNumber, String email, @NotNull LoanPurpose purpose, @NotNull @DecimalMin("100000") BigDecimal requestedAmount, @NotNull @Min(12) @Max(360) Integer requestedTenureMonths, @NotNull Channel channel, String branchCode) {}
