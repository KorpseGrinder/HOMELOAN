package com.hlms.domain.property.port.outbound;
import com.hlms.domain.property.entity.Property;
import com.hlms.domain.property.entity.PropertyValuation;
public interface ValuationVendorPort {
    PropertyValuation initiateValuation(Property property, String valuerId);
}
