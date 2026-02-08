package com.hlms.infrastructure.persistence.repository;

import com.hlms.infrastructure.persistence.entity.property.PropertyJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PropertyJpaRepository extends JpaRepository<PropertyJpaEntity, Long> {
    Optional<PropertyJpaEntity> findByApplicationId(Long applicationId);
}
