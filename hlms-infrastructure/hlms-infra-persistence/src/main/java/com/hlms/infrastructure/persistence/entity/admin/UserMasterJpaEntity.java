package com.hlms.infrastructure.persistence.entity.admin;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "USER_MASTER")
public class UserMasterJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_user") @SequenceGenerator(name = "seq_user", sequenceName = "SEQ_USER_MASTER_ID", allocationSize = 1) @Column(name = "USER_ID") private Long id;
    @Column(name = "USERNAME", unique = true, nullable = false) private String username;
    @Column(name = "PASSWORD_HASH", nullable = false) private String passwordHash;
    @Column(name = "EMPLOYEE_ID") private String employeeId;
    @Column(name = "FIRST_NAME", nullable = false) private String firstName;
    @Column(name = "LAST_NAME", nullable = false) private String lastName;
    @Column(name = "EMAIL") private String email;
    @Column(name = "MOBILE") private String mobile;
    @Column(name = "BRANCH_CODE") private String branchCode;
    @Column(name = "DESIGNATION") private String designation;
    @Column(name = "IS_ACTIVE") private Boolean isActive;
    @Column(name = "LAST_LOGIN_DATE") private LocalDateTime lastLoginDate;
    @Column(name = "PASSWORD_EXPIRY_DATE") private LocalDate passwordExpiryDate;
    @Column(name = "FAILED_LOGIN_ATTEMPTS") private Integer failedLoginAttempts;
    @Column(name = "ACCOUNT_LOCKED") private Boolean accountLocked;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
