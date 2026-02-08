package com.hlms.common.util.enums;

/**
 * Represents the lifecycle status of a loan account.
 */
public enum LoanStatus {
    PENDING_DISBURSEMENT,
    PARTIALLY_DISBURSED,
    ACTIVE,
    OVERDUE,
    NPA,
    RESTRUCTURED,
    WRITTEN_OFF,
    SETTLED,
    FORECLOSED,
    CLOSED
}
