package com.hlms.common.util.enums;

/**
 * Collection buckets based on DPD (Days Past Due) as per RBI/IRAC norms.
 * SMA = Special Mention Account
 * NPA = Non-Performing Asset
 */
public enum CollectionBucket {
    CURRENT,           // 0 DPD
    SMA_0,             // 1-30 DPD
    SMA_1,             // 31-60 DPD
    SMA_2,             // 61-90 DPD
    NPA_SUBSTANDARD,   // 91-365 DPD (up to 12 months)
    NPA_DOUBTFUL_D1,   // 366-730 DPD (12-24 months)
    NPA_DOUBTFUL_D2,   // 731-1095 DPD (24-36 months)
    NPA_DOUBTFUL_D3,   // 1096-1460 DPD (36-48 months)
    NPA_LOSS           // > 1460 DPD (> 48 months)
}
