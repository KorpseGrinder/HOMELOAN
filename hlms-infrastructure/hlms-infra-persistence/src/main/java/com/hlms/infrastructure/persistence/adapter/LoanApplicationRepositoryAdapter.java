package com.hlms.infrastructure.persistence.adapter;

import com.hlms.common.util.enums.ApplicationStatus;
import com.hlms.domain.loan.entity.LoanApplication;
import com.hlms.domain.loan.port.outbound.LoanApplicationRepository;
import com.hlms.infrastructure.persistence.entity.loan.LoanApplicationJpaEntity;
import com.hlms.infrastructure.persistence.repository.LoanApplicationJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class LoanApplicationRepositoryAdapter implements LoanApplicationRepository {

    private final LoanApplicationJpaRepository repo;

    @Override
    public LoanApplication save(LoanApplication app) {
        return toDomain(repo.save(toJpa(app)));
    }

    @Override
    public Optional<LoanApplication> findById(Long id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<LoanApplication> findByApplicationNumber(String applicationNumber) {
        return repo.findByApplicationNumber(applicationNumber).map(this::toDomain);
    }

    @Override
    public List<LoanApplication> findByCustomerId(Long customerId) {
        return repo.findByCustomerId(customerId).stream().map(this::toDomain).toList();
    }

    @Override
    public List<LoanApplication> findByStatus(ApplicationStatus status) {
        return repo.findByApplicationStatus(status).stream().map(this::toDomain).toList();
    }

    @Override
    public List<LoanApplication> findByAssignedOfficerId(Long officerId) {
        return repo.findByAssignedTo(officerId != null ? officerId.toString() : "").stream()
                .map(this::toDomain).toList();
    }

    private LoanApplicationJpaEntity toJpa(LoanApplication d) {
        return LoanApplicationJpaEntity.builder()
                .id(d.getId())
                .applicationNumber(d.getApplicationNumber())
                .customerId(d.getCustomerId())
                .productId(d.getProductId())
                .applicationStatus(d.getStatus())
                .purpose(d.getPurpose())
                .channel(d.getChannel())
                .requestedAmount(d.getRequestedAmount())
                .requestedTenureMonths(d.getRequestedTenure())
                .branchCode(d.getBranchId() != null ? d.getBranchId().toString() : null)
                .assignedTo(d.getAssignedOfficerId() != null ? d.getAssignedOfficerId().toString() : null)
                .createdBy(d.getCreatedBy())
                .createdDate(d.getCreatedDate())
                .modifiedBy(d.getModifiedBy())
                .modifiedDate(d.getModifiedDate())
                .version(d.getVersion())
                .build();
    }

    private LoanApplication toDomain(LoanApplicationJpaEntity j) {
        LoanApplication app = LoanApplication.builder()
                .applicationNumber(j.getApplicationNumber())
                .customerId(j.getCustomerId())
                .productId(j.getProductId())
                .status(j.getApplicationStatus())
                .purpose(j.getPurpose())
                .channel(j.getChannel())
                .requestedAmount(j.getRequestedAmount())
                .requestedTenure(j.getRequestedTenureMonths())
                .branchId(j.getBranchCode() != null ? Long.parseLong(j.getBranchCode()) : null)
                .assignedOfficerId(j.getAssignedTo() != null && !j.getAssignedTo().isBlank()
                        ? Long.parseLong(j.getAssignedTo()) : null)
                .build();
        app.setId(j.getId());
        app.setCreatedBy(j.getCreatedBy());
        app.setCreatedDate(j.getCreatedDate());
        app.setModifiedBy(j.getModifiedBy());
        app.setModifiedDate(j.getModifiedDate());
        app.setVersion(j.getVersion());
        return app;
    }
}
