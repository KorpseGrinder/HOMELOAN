package com.hlms.infrastructure.persistence.entity.customer;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "CUSTOMER_ADDRESS")
public class CustomerAddressJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_cust_addr") @SequenceGenerator(name = "seq_cust_addr", sequenceName = "SEQ_CUSTOMER_ADDRESS_ID", allocationSize = 1) @Column(name = "ADDRESS_ID") private Long id;
    @Column(name = "CUSTOMER_ID", nullable = false) private Long customerId;
    @Column(name = "ADDRESS_TYPE") private String addressType;
    @Column(name = "ADDRESS_LINE1", nullable = false) private String addressLine1;
    @Column(name = "ADDRESS_LINE2") private String addressLine2;
    @Column(name = "CITY") private String city;
    @Column(name = "STATE") private String state;
    @Column(name = "PIN_CODE") private String pinCode;
    @Column(name = "COUNTRY") private String country;
    @Column(name = "RESIDING_SINCE") private LocalDate residingSince;
    @Column(name = "IS_CURRENT") private Boolean isCurrent;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
