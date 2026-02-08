package com.hlms.domain.loan.entity;

import com.hlms.common.util.enums.ApprovalAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Tracks approval workflow history for a loan application.
 * Each record represents an action taken by a user in the approval chain.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoanApprovalWorkflow {

    private Long id;
    private Long applicationId;
    private String stage;
    private Long actorUserId;
    private String actorRole;
    private ApprovalAction action;
    private String remarks;
    private LocalDateTime actionDate;
    private String fromStatus;
    private String toStatus;
}
