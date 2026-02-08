package com.hlms.infrastructure.persistence.adapter;

import com.hlms.common.util.enums.PropertyConstructionStatus;
import com.hlms.common.util.enums.PropertyType;
import com.hlms.domain.property.entity.Property;
import com.hlms.domain.property.port.outbound.PropertyRepository;
import com.hlms.infrastructure.persistence.entity.property.PropertyJpaEntity;
import com.hlms.infrastructure.persistence.repository.PropertyJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PropertyRepositoryAdapter implements PropertyRepository {

    private final PropertyJpaRepository repo;

    @Override
    public Property save(Property p) {
        return toDomain(repo.save(toJpa(p)));
    }

    @Override
    public Optional<Property> findById(Long id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Property> findByApplicationId(Long applicationId) {
        return repo.findByApplicationId(applicationId).map(this::toDomain);
    }

    private PropertyJpaEntity toJpa(Property p) {
        return PropertyJpaEntity.builder()
                .id(p.getId())
                .applicationId(p.getApplicationId())
                .propertyType(p.getPropertyType() != null ? p.getPropertyType().name() : null)
                .constructionStatus(p.getConstructionStatus() != null ? p.getConstructionStatus().name() : null)
                .addressLine1(p.getAddressLine1())
                .addressLine2(p.getAddressLine2())
                .city(p.getCity())
                .state(p.getState())
                .pinCode(p.getPincode())
                .carpetArea(p.getCarpetAreaSqft())
                .builtUpArea(p.getBuiltUpAreaSqft())
                .plotArea(p.getSuperBuiltUpAreaSqft())
                .projectName(p.getProjectName())
                .builderName(p.getBuilderName())
                .surveyNumber(p.getSurveyNumber())
                .propertyAgeYears(p.getYearOfConstruction())
                .isApprovedProject(p.isApprovedByAuthority())
                .build();
    }

    private Property toDomain(PropertyJpaEntity e) {
        return Property.builder()
                .id(e.getId())
                .applicationId(e.getApplicationId())
                .propertyType(e.getPropertyType() != null ? PropertyType.valueOf(e.getPropertyType()) : null)
                .constructionStatus(e.getConstructionStatus() != null ? PropertyConstructionStatus.valueOf(e.getConstructionStatus()) : null)
                .addressLine1(e.getAddressLine1())
                .addressLine2(e.getAddressLine2())
                .city(e.getCity())
                .state(e.getState())
                .pincode(e.getPinCode())
                .carpetAreaSqft(e.getCarpetArea())
                .builtUpAreaSqft(e.getBuiltUpArea())
                .superBuiltUpAreaSqft(e.getPlotArea())
                .projectName(e.getProjectName())
                .builderName(e.getBuilderName())
                .surveyNumber(e.getSurveyNumber())
                .yearOfConstruction(e.getPropertyAgeYears())
                .approvedByAuthority(e.getIsApprovedProject() != null && e.getIsApprovedProject())
                .build();
    }
}
