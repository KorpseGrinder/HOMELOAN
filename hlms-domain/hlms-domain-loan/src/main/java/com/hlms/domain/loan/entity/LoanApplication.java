package com.hlms.domain.loan.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.ApplicationStatus;
import com.hlms.common.util.enums.Channel;
import com.hlms.common.util.enums.DocumentStatus;
import com.hlms.common.util.enums.LoanProductType;
import com.hlms.common.util.enums.LoanPurpose;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LoanApplication extends BaseEntity {

    private String applicationNumber;
    private Long customerId;
    private Long productId;
    private Long branchId;
    private BigDecimal requestedAmount;
    private Integer requestedTenure; // months
    private LoanPurpose purpose;
    private LoanProductType productType;
    private ApplicationStatus status;
    private Channel channel;
    private Long assignedOfficerId;
    private Long creditOfficerId;
    private Long approverId;
    private LocalDateTime submittedDate;
    private LocalDateTime sanctionedDate;
    private String remarks;

    // Aggregated child entities
    private List<CoApplicant> coApplicants;
    private List<LoanDocument> documents;
    private LoanCreditCheck creditCheck;
    private LoanEligibility eligibility;
    private LoanSanction sanction;
    private List<LoanApprovalWorkflow> approvalHistory;
    private List<LoanDeviation> deviations;

    /**
     * Checks if any deviations are still pending approval.
     */
    public boolean hasUnresolvedDeviations() {
        if (deviations == null || deviations.isEmpty()) {
            return false;
        }
        return deviations.stream().anyMatch(d -> d.getApprovedBy() == null);
    }

    /**
     * Checks if all required documents are uploaded and verified (none pending or rejected).
     */
    public boolean isDocumentComplete() {
        if (documents == null) {
            return false;
        }
        long pendingDocs = documents.stream()
            .filter(d -> d.getStatus() == DocumentStatus.PENDING || d.getStatus() == DocumentStatus.REJECTED)
            .count();
        return pendingDocs == 0 && !documents.isEmpty();
    }
}
