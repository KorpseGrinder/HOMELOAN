package com.hlms.infrastructure.persistence.adapter;

import com.hlms.common.util.enums.LoanProductType;
import com.hlms.domain.loan.entity.LoanProduct;
import com.hlms.domain.loan.port.outbound.LoanProductRepository;
import com.hlms.infrastructure.persistence.entity.loan.LoanProductJpaEntity;
import com.hlms.infrastructure.persistence.repository.LoanProductJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class LoanProductRepositoryAdapter implements LoanProductRepository {

    private final LoanProductJpaRepository repo;

    @Override
    public Optional<LoanProduct> findById(Long id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<LoanProduct> findByProductCode(String code) {
        return repo.findByProductCode(code).map(this::toDomain);
    }

    @Override
    public List<LoanProduct> findByProductType(LoanProductType type) {
        return repo.findByProductType(type.name()).stream().map(this::toDomain).toList();
    }

    @Override
    public List<LoanProduct> findAllActive() {
        return repo.findByIsActiveTrue().stream().map(this::toDomain).toList();
    }

    private LoanProduct toDomain(LoanProductJpaEntity e) {
        return LoanProduct.builder()
                .id(e.getId())
                .productCode(e.getProductCode())
                .productName(e.getProductName())
                .productType(e.getProductType() != null ? LoanProductType.valueOf(e.getProductType()) : null)
                .minLoanAmount(e.getMinLoanAmount())
                .maxLoanAmount(e.getMaxLoanAmount())
                .minTenureMonths(e.getMinTenureMonths())
                .maxTenureMonths(e.getMaxTenureMonths())
                .minInterestRate(e.getBaseInterestRate())
                .maxInterestRate(e.getBaseInterestRate())
                .maxLtvRatio(e.getMaxLtvRatio())
                .processingFeePercentage(e.getProcessingFeePercent())
                .active(e.getIsActive() != null && e.getIsActive())
                .build();
    }
}
