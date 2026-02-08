package com.hlms.infrastructure.persistence.repository;
import com.hlms.infrastructure.persistence.entity.servicing.LoanAccountJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface LoanAccountJpaRepository extends JpaRepository<LoanAccountJpaEntity, Long> { Optional<LoanAccountJpaEntity> findByLoanAccountNumber(String num); Optional<LoanAccountJpaEntity> findByApplicationId(Long appId); }
