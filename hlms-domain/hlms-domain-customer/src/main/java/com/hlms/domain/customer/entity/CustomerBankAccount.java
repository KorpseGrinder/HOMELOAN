package com.hlms.domain.customer.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.AccountType;
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
public class CustomerBankAccount extends BaseEntity {

    private Long customerId;
    private String bankName;
    private String branchName;
    private String accountNumber;
    private String ifscCode;
    private AccountType accountType;
    private String accountHolderName;
    private boolean isPrimary;
    private boolean isForDisbursement;
    private boolean isForNach;
}
