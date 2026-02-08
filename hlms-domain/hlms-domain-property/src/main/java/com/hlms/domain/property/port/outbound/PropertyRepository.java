package com.hlms.domain.property.port.outbound;
import com.hlms.domain.property.entity.Property;
import java.util.Optional;
public interface PropertyRepository {
    Property save(Property property);
    Optional<Property> findById(Long id);
    Optional<Property> findByApplicationId(Long applicationId);
}
