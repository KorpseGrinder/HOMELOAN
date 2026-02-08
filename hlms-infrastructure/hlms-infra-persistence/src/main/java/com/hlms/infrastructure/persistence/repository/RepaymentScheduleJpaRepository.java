package com.hlms.infrastructure.persistence.repository;

import com.hlms.infrastructure.persistence.entity.servicing.RepaymentScheduleJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepaymentScheduleJpaRepository extends JpaRepository<RepaymentScheduleJpaEntity, Long> {
    List<RepaymentScheduleJpaEntity> findByAccountIdOrderByInstallmentNumber(Long accountId);
    List<RepaymentScheduleJpaEntity> findByAccountIdAndScheduleStatus(Long accountId, String status);

    @Query("SELECT r FROM RepaymentScheduleJpaEntity r WHERE r.accountId = :accountId AND r.scheduleStatus = 'PENDING' ORDER BY r.dueDate ASC")
    Optional<RepaymentScheduleJpaEntity> findNextDue(@Param("accountId") Long accountId);

    @Modifying
    @Query("DELETE FROM RepaymentScheduleJpaEntity r WHERE r.accountId = :accountId AND r.scheduleStatus = 'PENDING'")
    void deleteByAccountIdAndStatusPending(@Param("accountId") Long accountId);
}
