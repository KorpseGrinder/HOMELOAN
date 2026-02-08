package com.hlms.domain.customer.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.EmploymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CustomerEmployment extends BaseEntity {

    private Long customerId;
    private EmploymentType employmentType;
    private String employerName;
    private String employerAddress;
    private String designation;
    private String department;
    private Integer yearsInCurrentJob;
    private Integer totalWorkExperience;
    private String officialEmail;
    private String officePhone;
    private boolean currentEmployment;
}
