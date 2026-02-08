package com.hlms.workflow.collection;

/**
 * Events that drive transitions in the collection workflow state machine.
 * Based on RBI IRAC norms for asset classification and DPD (Days Past Due) buckets.
 *
 * <p>SMA classification (RBI circular):
 * <ul>
 *   <li>SMA-0: Principal or interest payment overdue 1-30 days</li>
 *   <li>SMA-1: Principal or interest payment overdue 31-60 days</li>
 *   <li>SMA-2: Principal or interest payment overdue 61-90 days</li>
 * </ul>
 *
 * <p>NPA classification (90+ DPD):
 * <ul>
 *   <li>Substandard: NPA for up to 12 months</li>
 *   <li>Doubtful: NPA for more than 12 months</li>
 *   <li>Loss: Identified as loss by bank or auditor</li>
 * </ul>
 */
public enum CollectionEvent {

    /** Payment becomes overdue (1-30 DPD), triggers SMA-0 classification */
    PAYMENT_OVERDUE,

    /** Account slips to 31-60 DPD, escalates to SMA-1 */
    ESCALATE_SMA1,

    /** Account slips to 61-90 DPD, escalates to SMA-2 */
    ESCALATE_SMA2,

    /** Account crosses 90 DPD threshold, classified as NPA Substandard per IRAC norms */
    CLASSIFY_NPA,

    /** NPA account ages beyond 12 months, reclassified as Doubtful */
    DOWNGRADE_DOUBTFUL,

    /** Account identified as loss asset by bank or auditor */
    DOWNGRADE_LOSS,

    /** Loan account restructured under RBI restructuring framework */
    RESTRUCTURE,

    /** Full payment received or settlement completed, account resolved */
    RESOLVE,

    /** Overdue payment received, account restored to current/performing status */
    PAYMENT_RECEIVED,

    /** Upgrade from NPA back to performing status after sustained recovery */
    UPGRADE
}
