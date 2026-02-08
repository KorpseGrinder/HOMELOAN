package com.hlms.infrastructure.persistence.repository;

import com.hlms.infrastructure.persistence.entity.collection.LoanNpaJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanNpaJpaRepository extends JpaRepository<LoanNpaJpaEntity, Long> {
    Optional<LoanNpaJpaEntity> findByAccountId(Long accountId);
    List<LoanNpaJpaEntity> findByNpaCategory(String category);
    List<LoanNpaJpaEntity> findByIsUpgradedFalse();
}
