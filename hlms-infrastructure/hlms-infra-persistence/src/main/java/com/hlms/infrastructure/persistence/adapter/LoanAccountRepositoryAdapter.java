package com.hlms.infrastructure.persistence.adapter;

import com.hlms.common.util.enums.LoanStatus;
import com.hlms.common.util.enums.RateType;
import com.hlms.domain.servicing.entity.LoanAccount;
import com.hlms.domain.servicing.port.outbound.LoanAccountRepository;
import com.hlms.infrastructure.persistence.entity.servicing.LoanAccountJpaEntity;
import com.hlms.infrastructure.persistence.repository.LoanAccountJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class LoanAccountRepositoryAdapter implements LoanAccountRepository {

    private final LoanAccountJpaRepository repo;

    @Override
    public Optional<LoanAccount> findById(Long id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<LoanAccount> findByAccountNumber(String accountNumber) {
        return repo.findByLoanAccountNumber(accountNumber).map(this::toDomain);
    }

    @Override
    public Optional<LoanAccount> findByApplicationId(Long applicationId) {
        return repo.findByApplicationId(applicationId).map(this::toDomain);
    }

    @Override
    public LoanAccount save(LoanAccount account) {
        return toDomain(repo.save(toJpa(account)));
    }

    @Override
    public List<LoanAccount> findByCustomerId(Long customerId) {
        return repo.findAll().stream()
                .filter(e -> customerId.equals(e.getCustomerId()))
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<LoanAccount> findByStatus(LoanStatus status) {
        return repo.findAll().stream()
                .filter(e -> status.equals(e.getStatus()))
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<LoanAccount> findActiveAccountsByEmiDay(int emiDay) {
        return repo.findAll().stream()
                .filter(e -> e.getStatus() == LoanStatus.ACTIVE)
                .filter(e -> e.getFirstEmiDate() != null && e.getFirstEmiDate().getDayOfMonth() == emiDay)
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<LoanAccount> findAllActiveAccounts() {
        return repo.findAll().stream()
                .filter(e -> e.getStatus() == LoanStatus.ACTIVE)
                .map(this::toDomain)
                .toList();
    }

    @Override
    public long countByBranchIdAndStatus(Long branchId, LoanStatus status) {
        return repo.findAll().stream()
                .filter(e -> status.equals(e.getStatus()))
                .count();
    }

    private LoanAccountJpaEntity toJpa(LoanAccount a) {
        return LoanAccountJpaEntity.builder()
                .id(a.getId())
                .loanAccountNumber(a.getAccountNumber())
                .applicationId(a.getApplicationId())
                .customerId(a.getCustomerId())
                .status(a.getStatus())
                .sanctionedAmount(a.getSanctionedAmount())
                .disbursedAmount(a.getDisbursedAmount())
                .outstandingPrincipal(a.getOutstandingPrincipal())
                .outstandingInterest(a.getOutstandingInterest())
                .rateType(a.getRateType())
                .interestRate(a.getCurrentInterestRate())
                .tenureMonths(a.getTenure())
                .emiAmount(a.getEmiAmount())
                .firstEmiDate(a.getFirstEmiDate())
                .dpd(a.getDpd())
                .build();
    }

    private LoanAccount toDomain(LoanAccountJpaEntity e) {
        LoanAccount account = LoanAccount.builder()
                .accountNumber(e.getLoanAccountNumber())
                .applicationId(e.getApplicationId())
                .customerId(e.getCustomerId())
                .status(e.getStatus())
                .sanctionedAmount(e.getSanctionedAmount())
                .disbursedAmount(e.getDisbursedAmount())
                .outstandingPrincipal(e.getOutstandingPrincipal())
                .outstandingInterest(e.getOutstandingInterest())
                .rateType(e.getRateType())
                .currentInterestRate(e.getInterestRate())
                .tenure(e.getTenureMonths())
                .emiAmount(e.getEmiAmount())
                .firstEmiDate(e.getFirstEmiDate())
                .dpd(e.getDpd())
                .build();
        account.setId(e.getId());
        return account;
    }
}
