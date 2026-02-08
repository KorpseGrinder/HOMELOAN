package com.hlms.infrastructure.persistence.entity.customer;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "CUSTOMER_EMPLOYMENT")
public class CustomerEmploymentJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_cust_emp") @SequenceGenerator(name = "seq_cust_emp", sequenceName = "SEQ_CUSTOMER_EMPLOYMENT_ID", allocationSize = 1) @Column(name = "EMPLOYMENT_ID") private Long id;
    @Column(name = "CUSTOMER_ID", nullable = false) private Long customerId;
    @Column(name = "EMPLOYMENT_TYPE") private String employmentType;
    @Column(name = "EMPLOYER_NAME") private String employerName;
    @Column(name = "DESIGNATION") private String designation;
    @Column(name = "EMPLOYEE_ID") private String employeeId;
    @Column(name = "WORK_EXPERIENCE_YEARS") private Integer workExperienceYears;
    @Column(name = "CURRENT_EMPLOYER_YEARS") private Integer currentEmployerYears;
    @Column(name = "OFFICE_ADDRESS") private String officeAddress;
    @Column(name = "OFFICE_PHONE") private String officePhone;
    @Column(name = "IS_CURRENT") private Boolean isCurrent;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
