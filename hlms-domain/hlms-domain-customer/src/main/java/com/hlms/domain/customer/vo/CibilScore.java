package com.hlms.domain.customer.vo;

import com.hlms.common.util.enums.CreditBureau;

import java.time.LocalDateTime;

/**
 * Value object representing a credit score fetched from a bureau.
 */
public record CibilScore(
    int score,
    CreditBureau bureau,
    LocalDateTime fetchDate,
    String reportReference,
    boolean isValid
) {
    public CibilScore {
        isValid = score >= 300 && score <= 900;
    }

    /**
     * Checks if the score meets or exceeds the given threshold.
     */
    public boolean isAboveThreshold(int threshold) {
        return score >= threshold;
    }
}
