package com.hlms.infrastructure.persistence.entity.property;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "PROPERTY")
public class PropertyJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_prop") @SequenceGenerator(name = "seq_prop", sequenceName = "SEQ_PROPERTY_ID", allocationSize = 1) @Column(name = "PROPERTY_ID") private Long id;
    @Column(name = "APPLICATION_ID", nullable = false) private Long applicationId;
    @Column(name = "PROPERTY_TYPE") private String propertyType;
    @Column(name = "CONSTRUCTION_STATUS") private String constructionStatus;
    @Column(name = "ADDRESS_LINE1") private String addressLine1;
    @Column(name = "ADDRESS_LINE2") private String addressLine2;
    @Column(name = "CITY") private String city;
    @Column(name = "STATE") private String state;
    @Column(name = "PIN_CODE") private String pinCode;
    @Column(name = "SURVEY_NUMBER") private String surveyNumber;
    @Column(name = "PLOT_AREA", precision = 10, scale = 2) private BigDecimal plotArea;
    @Column(name = "BUILT_UP_AREA", precision = 10, scale = 2) private BigDecimal builtUpArea;
    @Column(name = "CARPET_AREA", precision = 10, scale = 2) private BigDecimal carpetArea;
    @Column(name = "PROPERTY_AGE_YEARS") private Integer propertyAgeYears;
    @Column(name = "BUILDER_NAME") private String builderName;
    @Column(name = "PROJECT_NAME") private String projectName;
    @Column(name = "IS_APPROVED_PROJECT") private Boolean isApprovedProject;
    @Column(name = "RERA_NUMBER") private String reraNumber;
    @Column(name = "EXPECTED_COMPLETION_DATE") private LocalDate expectedCompletionDate;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
