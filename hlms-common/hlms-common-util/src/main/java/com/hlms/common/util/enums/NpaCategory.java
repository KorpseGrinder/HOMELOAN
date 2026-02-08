package com.hlms.common.util.enums;

/**
 * NPA classification categories as per RBI IRAC norms.
 */
public enum NpaCategory {
    STANDARD,      // Regular performing asset
    SUBSTANDARD,   // NPA for up to 12 months (90-365 DPD)
    DOUBTFUL_1,    // NPA for 12-24 months (D1)
    DOUBTFUL_2,    // NPA for 24-36 months (D2)
    DOUBTFUL_3,    // NPA for 36+ months (D3)
    LOSS           // Loss asset - uncollectable
}
