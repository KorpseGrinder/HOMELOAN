package com.hlms.infrastructure.persistence.entity.property;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor @Entity @Table(name = "PROPERTY_VALUATION")
public class PropertyValuationJpaEntity {
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_prop_val") @SequenceGenerator(name = "seq_prop_val", sequenceName = "SEQ_PROPERTY_VALUATION_ID", allocationSize = 1) @Column(name = "VALUATION_ID") private Long id;
    @Column(name = "PROPERTY_ID", nullable = false) private Long propertyId;
    @Column(name = "VALUATION_TYPE") private String valuationType;
    @Column(name = "VALUATION_STATUS") private String valuationStatus;
    @Column(name = "VALUATOR_NAME") private String valuatorName;
    @Column(name = "VALUATOR_LICENSE") private String valuatorLicense;
    @Column(name = "VALUATION_DATE") private LocalDate valuationDate;
    @Column(name = "FAIR_MARKET_VALUE", precision = 15, scale = 2) private BigDecimal fairMarketValue;
    @Column(name = "FORCED_SALE_VALUE", precision = 15, scale = 2) private BigDecimal forcedSaleValue;
    @Column(name = "DISTRESS_VALUE", precision = 15, scale = 2) private BigDecimal distressValue;
    @Column(name = "GUIDELINE_VALUE", precision = 15, scale = 2) private BigDecimal guidelineValue;
    @Column(name = "REMARKS", length = 2000) private String remarks;
    @Column(name = "REPORT_FILE_PATH") private String reportFilePath;
    @Column(name = "CREATED_BY") private String createdBy;
    @Column(name = "CREATED_DATE") private LocalDateTime createdDate;
    @Column(name = "MODIFIED_BY") private String modifiedBy;
    @Column(name = "MODIFIED_DATE") private LocalDateTime modifiedDate;
    @Version @Column(name = "VERSION") private Long version;
    @PrePersist protected void onCreate() { createdDate = LocalDateTime.now(); modifiedDate = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { modifiedDate = LocalDateTime.now(); }
}
