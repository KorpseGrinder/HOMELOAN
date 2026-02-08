package com.hlms.infrastructure.persistence.adapter;

import com.hlms.common.util.enums.CaseStatus;
import com.hlms.common.util.enums.CollectionBucket;
import com.hlms.domain.collection.entity.CollectionCase;
import com.hlms.domain.collection.port.outbound.CollectionRepository;
import com.hlms.infrastructure.persistence.entity.collection.CollectionCaseJpaEntity;
import com.hlms.infrastructure.persistence.repository.CollectionCaseJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CollectionRepositoryAdapter implements CollectionRepository {

    private final CollectionCaseJpaRepository repo;

    @Override
    public CollectionCase save(CollectionCase c) {
        return toDomain(repo.save(toJpa(c)));
    }

    @Override
    public Optional<CollectionCase> findById(Long id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<CollectionCase> findByLoanAccountId(Long loanAccountId) {
        return repo.findByAccountId(loanAccountId).map(this::toDomain);
    }

    @Override
    public List<CollectionCase> findByBucket(CollectionBucket bucket) {
        return repo.findByCollectionBucket(bucket.name()).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<CollectionCase> findByStatus(CaseStatus status) {
        return repo.findByCaseStatus(status.name()).stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public List<CollectionCase> findByAssignedTo(String userId) {
        return repo.findByAssignedTo(userId).stream()
                .map(this::toDomain)
                .toList();
    }

    private CollectionCaseJpaEntity toJpa(CollectionCase c) {
        return CollectionCaseJpaEntity.builder()
                .id(c.getId())
                .accountId(c.getLoanAccountId())
                .collectionBucket(c.getBucket() != null ? c.getBucket().name() : null)
                .caseStatus(c.getStatus() != null ? c.getStatus().name() : null)
                .assignedTo(c.getAssignedTo())
                .dpd(c.getDpd())
                .overdueAmount(c.getTotalOverdueAmount())
                .resolutionRemarks(c.getRemarks())
                .build();
    }

    private CollectionCase toDomain(CollectionCaseJpaEntity e) {
        return CollectionCase.builder()
                .id(e.getId())
                .loanAccountId(e.getAccountId())
                .bucket(e.getCollectionBucket() != null ? CollectionBucket.valueOf(e.getCollectionBucket()) : null)
                .status(e.getCaseStatus() != null ? CaseStatus.valueOf(e.getCaseStatus()) : null)
                .assignedTo(e.getAssignedTo())
                .dpd(e.getDpd())
                .totalOverdueAmount(e.getOverdueAmount())
                .remarks(e.getResolutionRemarks())
                .build();
    }
}
