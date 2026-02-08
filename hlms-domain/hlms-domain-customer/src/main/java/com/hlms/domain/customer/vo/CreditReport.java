package com.hlms.domain.customer.vo;

import com.hlms.common.util.enums.CreditBureau;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Value object representing a full credit report from a bureau.
 */
public record CreditReport(
    int score,
    CreditBureau bureau,
    int activeLoans,
    int activeCreditCards,
    BigDecimal totalOutstanding,
    BigDecimal totalEmiAmount,
    int enquiriesLast6Months,
    int defaultsLast12Months,
    int settlementsCount,
    int oldestAccountAgeMonths,
    LocalDateTime reportDate,
    String reportReference
) {}
