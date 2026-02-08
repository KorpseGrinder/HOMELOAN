package com.hlms.infrastructure.persistence.adapter;

import com.hlms.common.util.enums.NpaCategory;
import com.hlms.domain.collection.entity.LoanNpa;
import com.hlms.domain.collection.port.outbound.NpaRepository;
import com.hlms.infrastructure.persistence.entity.collection.LoanNpaJpaEntity;
import com.hlms.infrastructure.persistence.repository.LoanNpaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class NpaRepositoryAdapter implements NpaRepository {

    private final LoanNpaJpaRepository repo;

    @Override
    public LoanNpa save(LoanNpa npa) {
        return toDomain(repo.save(toJpa(npa)));
    }

    @Override
    public Optional<LoanNpa> findByLoanAccountId(Long loanAccountId) {
        return repo.findByAccountId(loanAccountId).map(this::toDomain);
    }

    @Override
    public List<LoanNpa> findByNpaCategory(NpaCategory category) {
        return repo.findByNpaCategory(category.name()).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<LoanNpa> findAllActiveNpas() {
        return repo.findByIsUpgradedFalse().stream()
                .map(this::toDomain)
                .toList();
    }

    private LoanNpaJpaEntity toJpa(LoanNpa n) {
        return LoanNpaJpaEntity.builder()
                .id(n.getId())
                .accountId(n.getLoanAccountId())
                .npaCategory(n.getNpaCategory() != null ? n.getNpaCategory().name() : null)
                .npaDate(n.getNpaDate())
                .classificationDate(n.getClassificationDate())
                .dpd(n.getDpd())
                .outstandingAmount(n.getOutstandingAmount())
                .provisionAmount(n.getProvisionAmount())
                .provisionPercentage(n.getProvisionPercentage())
                .isUpgraded(n.isUpgraded())
                .upgradeDate(n.getUpgradeDate())
                .build();
    }

    private LoanNpa toDomain(LoanNpaJpaEntity e) {
        return LoanNpa.builder()
                .id(e.getId())
                .loanAccountId(e.getAccountId())
                .npaCategory(e.getNpaCategory() != null ? NpaCategory.valueOf(e.getNpaCategory()) : null)
                .npaDate(e.getNpaDate())
                .classificationDate(e.getClassificationDate())
                .dpd(e.getDpd())
                .outstandingAmount(e.getOutstandingAmount())
                .provisionAmount(e.getProvisionAmount())
                .provisionPercentage(e.getProvisionPercentage())
                .upgraded(e.getIsUpgraded() != null && e.getIsUpgraded())
                .upgradeDate(e.getUpgradeDate())
                .build();
    }
}
