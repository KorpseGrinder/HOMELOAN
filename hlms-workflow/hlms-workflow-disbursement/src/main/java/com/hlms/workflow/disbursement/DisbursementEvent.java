package com.hlms.workflow.disbursement;

/**
 * Events that drive transitions in the disbursement workflow state machine.
 * Each event corresponds to a step in the post-sanction disbursement process.
 */
public enum DisbursementEvent {

    /** Execute loan agreement and obtain borrower signatures */
    EXECUTE_AGREEMENT,

    /** Register charge with CERSAI (Central Registry of Securitisation) */
    REGISTER_CERSAI,

    /** Set up NACH (National Automated Clearing House) mandate for EMI collection */
    ACTIVATE_NACH,

    /** Complete all pre-disbursement checks (insurance linkage, compliance, etc.) */
    COMPLETE_PRE_DISBURSEMENT,

    /** Approve and initiate fund transfer to borrower/builder */
    DISBURSE_FUNDS,

    /** Reject the disbursement at any stage due to non-compliance or discrepancies */
    REJECT
}
