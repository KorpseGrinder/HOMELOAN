package com.hlms.infrastructure.persistence.repository;

import com.hlms.common.util.enums.ApplicationStatus;
import com.hlms.infrastructure.persistence.entity.loan.LoanApplicationJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LoanApplicationJpaRepository extends JpaRepository<LoanApplicationJpaEntity, Long> {

    Optional<LoanApplicationJpaEntity> findByApplicationNumber(String applicationNumber);

    List<LoanApplicationJpaEntity> findByCustomerId(Long customerId);

    List<LoanApplicationJpaEntity> findByApplicationStatus(ApplicationStatus status);

    List<LoanApplicationJpaEntity> findByAssignedTo(String assignedTo);
}
