package com.hlms.domain.property.service;

import com.hlms.common.util.enums.TitleStatus;
import com.hlms.common.util.enums.ValuationStatus;
import com.hlms.domain.property.entity.PropertyLegalOpinion;
import com.hlms.domain.property.entity.PropertyValuation;

import java.math.BigDecimal;
import java.util.List;

public class PropertyDomainService {
    public boolean isValuationComplete(List<PropertyValuation> valuations) { return valuations != null && valuations.stream().anyMatch(v -> v.getStatus() == ValuationStatus.COMPLETED); }
    public boolean isTitleClear(PropertyLegalOpinion opinion) { return opinion != null && opinion.getTitleStatus() == TitleStatus.CLEAR && opinion.isEncumbranceFree() && opinion.isLitigationFree(); }
    public BigDecimal getPropertyValueForLtv(List<PropertyValuation> valuations) { return valuations.stream().filter(v -> v.getStatus() == ValuationStatus.COMPLETED).map(PropertyValuation::getFairMarketValue).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO); }
    public boolean requiresDualValuation(BigDecimal loanAmount) { return loanAmount.compareTo(new BigDecimal("10000000")) > 0; }
}
