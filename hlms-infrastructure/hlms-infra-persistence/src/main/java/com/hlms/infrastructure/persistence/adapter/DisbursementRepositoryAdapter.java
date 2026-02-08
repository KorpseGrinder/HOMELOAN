package com.hlms.infrastructure.persistence.adapter;

import com.hlms.common.util.enums.DisbursementStatus;
import com.hlms.common.util.enums.DisbursementType;
import com.hlms.domain.disbursement.entity.LoanDisbursement;
import com.hlms.domain.disbursement.port.outbound.DisbursementRepository;
import com.hlms.infrastructure.persistence.entity.disbursement.LoanDisbursementJpaEntity;
import com.hlms.infrastructure.persistence.repository.DisbursementJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DisbursementRepositoryAdapter implements DisbursementRepository {

    private final DisbursementJpaRepository repo;

    @Override
    public LoanDisbursement save(LoanDisbursement d) {
        return toDomain(repo.save(toJpa(d)));
    }

    @Override
    public Optional<LoanDisbursement> findById(Long id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public List<LoanDisbursement> findByApplicationId(Long applicationId) {
        return repo.findByApplicationId(applicationId).stream().map(this::toDomain).toList();
    }

    private LoanDisbursementJpaEntity toJpa(LoanDisbursement d) {
        return LoanDisbursementJpaEntity.builder()
                .id(d.getId())
                .applicationId(d.getApplicationId())
                .disbursementType(d.getDisbursementType() != null ? d.getDisbursementType().name() : null)
                .disbursementStatus(d.getStatus() != null ? d.getStatus().name() : null)
                .trancheNumber(d.getTrancheNumber())
                .disbursementAmount(d.getDisbursementAmount())
                .disbursementDate(d.getDisbursementDate())
                .utrNumber(d.getUtrNumber())
                .beneficiaryName(d.getBeneficiaryName())
                .beneficiaryAccount(d.getBeneficiaryAccountNumber())
                .beneficiaryIfsc(d.getBeneficiaryIfscCode())
                .isBalanceTransfer(d.isBalanceTransfer())
                .btLenderName(d.getBtBankName())
                .btLoanAccount(d.getBtLoanAccountNumber())
                .btOutstandingAmount(d.getBtOutstandingAmount())
                .approvedBy(d.getApprovedBy())
                .remarks(d.getRemarks())
                .build();
    }

    private LoanDisbursement toDomain(LoanDisbursementJpaEntity j) {
        return LoanDisbursement.builder()
                .id(j.getId())
                .applicationId(j.getApplicationId())
                .disbursementType(j.getDisbursementType() != null ? DisbursementType.valueOf(j.getDisbursementType()) : null)
                .status(j.getDisbursementStatus() != null ? DisbursementStatus.valueOf(j.getDisbursementStatus()) : null)
                .trancheNumber(j.getTrancheNumber())
                .disbursementAmount(j.getDisbursementAmount())
                .disbursementDate(j.getDisbursementDate())
                .utrNumber(j.getUtrNumber())
                .beneficiaryName(j.getBeneficiaryName())
                .beneficiaryAccountNumber(j.getBeneficiaryAccount())
                .beneficiaryIfscCode(j.getBeneficiaryIfsc())
                .balanceTransfer(j.getIsBalanceTransfer() != null && j.getIsBalanceTransfer())
                .btBankName(j.getBtLenderName())
                .btLoanAccountNumber(j.getBtLoanAccount())
                .btOutstandingAmount(j.getBtOutstandingAmount())
                .approvedBy(j.getApprovedBy())
                .remarks(j.getRemarks())
                .build();
    }
}
