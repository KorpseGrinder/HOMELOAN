package com.hlms.domain.customer.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.AddressType;
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
public class CustomerAddress extends BaseEntity {

    private Long customerId;
    private AddressType addressType;
    private String addressLine1;
    private String addressLine2;
    private String landmark;
    private String city;
    private String district;
    private String state;
    private String pincode;
    private String country;
    private boolean isPrimary;
    private Integer yearsAtAddress;
}
