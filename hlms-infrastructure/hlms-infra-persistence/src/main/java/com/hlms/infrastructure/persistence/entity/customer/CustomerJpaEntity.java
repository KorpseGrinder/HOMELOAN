package com.hlms.infrastructure.persistence.entity.customer;
import com.hlms.common.util.enums.*;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "CUSTOMER")
public class CustomerJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_cust") @SequenceGenerator(name = "seq_cust", sequenceName = "SEQ_CUSTOMER_ID", allocationSize = 1) @Column(name = "CUSTOMER_ID") private Long id;
    @Column(name = "FIRST_NAME", nullable = false) private String firstName;
    @Column(name = "LAST_NAME", nullable = false) private String lastName;
    @Column(name = "MIDDLE_NAME") private String middleName;
    @Column(name = "DATE_OF_BIRTH") private LocalDate dateOfBirth;
    @Enumerated(EnumType.STRING) @Column(name = "GENDER") private Gender gender;
    @Enumerated(EnumType.STRING) @Column(name = "MARITAL_STATUS") private MaritalStatus maritalStatus;
    @Enumerated(EnumType.STRING) @Column(name = "CUSTOMER_TYPE", nullable = false) private CustomerType customerType;
    @Enumerated(EnumType.STRING) @Column(name = "CUSTOMER_CATEGORY") private CustomerCategory customerCategory;
    @Enumerated(EnumType.STRING) @Column(name = "RESIDENT_STATUS") private ResidentStatus residentStatus;
    @Column(name = "PAN_NUMBER") private String panNumber;
    @Column(name = "AADHAAR_NUMBER") private String aadhaarNumber;
    @Column(name = "MOBILE_NUMBER", nullable = false) private String mobileNumber;
    @Column(name = "EMAIL") private String email;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
