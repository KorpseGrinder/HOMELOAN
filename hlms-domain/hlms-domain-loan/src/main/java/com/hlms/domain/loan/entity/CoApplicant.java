package com.hlms.domain.loan.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.CoApplicantType;
import com.hlms.common.util.enums.RelationshipType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CoApplicant extends BaseEntity {

    private Long applicationId;
    private Long customerId;
    private RelationshipType relationship;
    private CoApplicantType coApplicantType;
    private BigDecimal incomeWeightage; // percentage: 100, 50, 25, 0
    private boolean incomeConsidered;
    private String remarks;
}
