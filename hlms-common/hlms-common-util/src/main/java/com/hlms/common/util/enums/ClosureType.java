package com.hlms.common.util.enums;

/**
 * Types of loan closure.
 */
public enum ClosureType {
    REGULAR,         // Normal tenure completion
    FORECLOSURE,     // Full prepayment before tenure
    SETTLEMENT,      // OTS - One Time Settlement
    WRITE_OFF,       // Written off as loss
    TRANSFER,        // Loan transferred to another institution
    TAKEOVER         // Taken over by another bank
}
