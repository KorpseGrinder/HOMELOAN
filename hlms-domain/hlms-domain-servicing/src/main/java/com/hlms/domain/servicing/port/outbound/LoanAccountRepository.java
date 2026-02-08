package com.hlms.domain.servicing.port.outbound;

import com.hlms.common.util.enums.LoanStatus;
import com.hlms.domain.servicing.entity.LoanAccount;

import java.util.List;
import java.util.Optional;

/**
 * Outbound port for loan account persistence operations.
 * Implemented by infrastructure layer adapters (e.g., JPA repository).
 */
public interface LoanAccountRepository {

    Optional<LoanAccount> findById(Long id);

    Optional<LoanAccount> findByAccountNumber(String accountNumber);

    Optional<LoanAccount> findByApplicationId(Long applicationId);

    LoanAccount save(LoanAccount account);

    List<LoanAccount> findByCustomerId(Long customerId);

    List<LoanAccount> findByStatus(LoanStatus status);

    List<LoanAccount> findActiveAccountsByEmiDay(int emiDay);

    List<LoanAccount> findAllActiveAccounts();

    long countByBranchIdAndStatus(Long branchId, LoanStatus status);
}