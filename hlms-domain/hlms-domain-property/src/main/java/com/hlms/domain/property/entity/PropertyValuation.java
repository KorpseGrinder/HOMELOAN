package com.hlms.domain.property.entity;
import com.hlms.common.util.enums.ValuationStatus;
import com.hlms.common.util.enums.ValuationType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PropertyValuation {
    private Long id; private Long propertyId; private ValuationType valuationType; private ValuationStatus status;
    private String valuerId; private String valuerName;
    private BigDecimal fairMarketValue; private BigDecimal forcedSaleValue; private BigDecimal ratePerSqft; private BigDecimal governmentValue;
    private LocalDate valuationDate; private LocalDate reportDate; private String remarks;
}
