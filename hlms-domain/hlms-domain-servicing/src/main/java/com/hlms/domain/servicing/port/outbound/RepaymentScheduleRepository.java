package com.hlms.domain.servicing.port.outbound;

import com.hlms.domain.servicing.entity.RepaymentSchedule;

import java.util.List;
import java.util.Optional;

/**
 * Outbound port for repayment schedule persistence operations.
 * Implemented by infrastructure layer adapters.
 */
public interface RepaymentScheduleRepository {

    List<RepaymentSchedule> findByLoanAccountId(Long loanAccountId);

    List<RepaymentSchedule> findPendingByLoanAccountId(Long loanAccountId);

    RepaymentSchedule save(RepaymentSchedule schedule);

    void saveAll(List<RepaymentSchedule> schedules);

    void deleteByLoanAccountIdAndStatusPending(Long loanAccountId);

    Optional<RepaymentSchedule> findNextDue(Long loanAccountId);
}