package com.hlms.infrastructure.persistence.adapter;

import com.hlms.common.util.enums.ScheduleStatus;
import com.hlms.domain.servicing.entity.RepaymentSchedule;
import com.hlms.domain.servicing.port.outbound.RepaymentScheduleRepository;
import com.hlms.infrastructure.persistence.entity.servicing.RepaymentScheduleJpaEntity;
import com.hlms.infrastructure.persistence.repository.RepaymentScheduleJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RepaymentScheduleRepositoryAdapter implements RepaymentScheduleRepository {

    private final RepaymentScheduleJpaRepository repo;

    @Override
    public List<RepaymentSchedule> findByLoanAccountId(Long loanAccountId) {
        return repo.findByAccountIdOrderByInstallmentNumber(loanAccountId).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<RepaymentSchedule> findPendingByLoanAccountId(Long loanAccountId) {
        return repo.findByAccountIdAndScheduleStatus(loanAccountId, "PENDING").stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public RepaymentSchedule save(RepaymentSchedule schedule) {
        return toDomain(repo.save(toJpa(schedule)));
    }

    @Override
    public void saveAll(List<RepaymentSchedule> schedules) {
        repo.saveAll(schedules.stream().map(this::toJpa).toList());
    }

    @Override
    @Transactional
    public void deleteByLoanAccountIdAndStatusPending(Long loanAccountId) {
        repo.deleteByAccountIdAndStatusPending(loanAccountId);
    }

    @Override
    public Optional<RepaymentSchedule> findNextDue(Long loanAccountId) {
        return repo.findNextDue(loanAccountId).map(this::toDomain);
    }

    private RepaymentScheduleJpaEntity toJpa(RepaymentSchedule s) {
        return RepaymentScheduleJpaEntity.builder()
                .id(s.getId())
                .accountId(s.getLoanAccountId())
                .installmentNumber(s.getEmiNumber())
                .dueDate(s.getDueDate())
                .openingBalance(s.getOpeningBalance())
                .principalComponent(s.getPrincipalComponent())
                .interestComponent(s.getInterestComponent())
                .emiAmount(s.getEmiAmount())
                .closingBalance(s.getClosingBalance())
                .scheduleStatus(s.getStatus() != null ? s.getStatus().name() : null)
                .build();
    }

    private RepaymentSchedule toDomain(RepaymentScheduleJpaEntity e) {
        RepaymentSchedule schedule = RepaymentSchedule.builder()
                .loanAccountId(e.getAccountId())
                .emiNumber(e.getInstallmentNumber())
                .dueDate(e.getDueDate())
                .openingBalance(e.getOpeningBalance())
                .principalComponent(e.getPrincipalComponent())
                .interestComponent(e.getInterestComponent())
                .emiAmount(e.getEmiAmount())
                .closingBalance(e.getClosingBalance())
                .status(e.getScheduleStatus() != null ? ScheduleStatus.valueOf(e.getScheduleStatus()) : null)
                .build();
        schedule.setId(e.getId());
        return schedule;
    }
}
