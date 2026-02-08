package com.hlms.infrastructure.persistence.repository;

import com.hlms.infrastructure.persistence.entity.loan.LoanProductJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanProductJpaRepository extends JpaRepository<LoanProductJpaEntity, Long> {
    Optional<LoanProductJpaEntity> findByProductCode(String productCode);
    List<LoanProductJpaEntity> findByProductType(String productType);
    List<LoanProductJpaEntity> findByIsActiveTrue();
}
