package com.hlms.common.util.constants;

public final class ErrorCodes {

    private ErrorCodes() {}

    // Customer errors
    public static final String CUSTOMER_NOT_FOUND = "HLMS-CUST-001";
    public static final String CUSTOMER_DUPLICATE = "HLMS-CUST-002";
    public static final String CUSTOMER_KYC_INCOMPLETE = "HLMS-CUST-003";
    public static final String CUSTOMER_INELIGIBLE = "HLMS-CUST-004";

    // Loan application errors
    public static final String APPLICATION_NOT_FOUND = "HLMS-LOAN-001";
    public static final String APPLICATION_INVALID_STATE = "HLMS-LOAN-002";
    public static final String APPLICATION_DOCUMENTS_INCOMPLETE = "HLMS-LOAN-003";
    public static final String APPLICATION_CREDIT_CHECK_FAILED = "HLMS-LOAN-004";
    public static final String APPLICATION_ELIGIBILITY_FAILED = "HLMS-LOAN-005";
    public static final String APPLICATION_DEVIATION_UNRESOLVED = "HLMS-LOAN-006";
    public static final String APPLICATION_AUTHORITY_EXCEEDED = "HLMS-LOAN-007";

    // Property errors
    public static final String PROPERTY_NOT_FOUND = "HLMS-PROP-001";
    public static final String PROPERTY_VALUATION_PENDING = "HLMS-PROP-002";
    public static final String PROPERTY_TITLE_UNCLEAR = "HLMS-PROP-003";
    public static final String PROPERTY_LTV_EXCEEDED = "HLMS-PROP-004";

    // Disbursement errors
    public static final String DISBURSEMENT_NOT_FOUND = "HLMS-DISB-001";
    public static final String DISBURSEMENT_PRECONDITION_FAILED = "HLMS-DISB-002";
    public static final String DISBURSEMENT_AGREEMENT_UNSIGNED = "HLMS-DISB-003";
    public static final String DISBURSEMENT_FUND_TRANSFER_FAILED = "HLMS-DISB-004";

    // Servicing errors
    public static final String LOAN_ACCOUNT_NOT_FOUND = "HLMS-SERV-001";
    public static final String EMI_ALREADY_PAID = "HLMS-SERV-002";
    public static final String PREPAYMENT_INVALID = "HLMS-SERV-003";
    public static final String CLOSURE_CONDITIONS_UNMET = "HLMS-SERV-004";

    // Collection errors
    public static final String COLLECTION_CASE_NOT_FOUND = "HLMS-COLL-001";
    public static final String NPA_CLASSIFICATION_ERROR = "HLMS-COLL-002";

    // Auth errors
    public static final String AUTH_INVALID_CREDENTIALS = "HLMS-AUTH-001";
    public static final String AUTH_TOKEN_EXPIRED = "HLMS-AUTH-002";
    public static final String AUTH_UNAUTHORIZED = "HLMS-AUTH-003";
    public static final String AUTH_FORBIDDEN = "HLMS-AUTH-004";

    // General errors
    public static final String VALIDATION_ERROR = "HLMS-GEN-001";
    public static final String INTERNAL_ERROR = "HLMS-GEN-002";
    public static final String INTEGRATION_ERROR = "HLMS-GEN-003";
    public static final String WORKFLOW_ERROR = "HLMS-GEN-004";
}
