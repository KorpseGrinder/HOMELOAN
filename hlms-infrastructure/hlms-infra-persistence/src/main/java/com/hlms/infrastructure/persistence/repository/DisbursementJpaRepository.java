package com.hlms.infrastructure.persistence.repository;

import com.hlms.infrastructure.persistence.entity.disbursement.LoanDisbursementJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisbursementJpaRepository extends JpaRepository<LoanDisbursementJpaEntity, Long> {
    List<LoanDisbursementJpaEntity> findByApplicationId(Long applicationId);
}
