package com.hlms.application.disbursement.usecase;
import com.hlms.application.disbursement.dto.*;
import com.hlms.common.exception.types.BusinessRuleViolationException;
import com.hlms.common.util.constants.ErrorCodes;
import com.hlms.common.util.enums.DisbursementStatus;
import com.hlms.domain.disbursement.entity.LoanDisbursement;
import com.hlms.domain.disbursement.port.outbound.DisbursementRepository;
import com.hlms.domain.disbursement.port.outbound.FundTransferPort;
import com.hlms.domain.disbursement.vo.FundTransferRequest;
import com.hlms.domain.disbursement.vo.FundTransferResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
@Service @Transactional
public class InitiateDisbursementUseCase {
    private final DisbursementRepository repo;
    private final FundTransferPort ftPort;
    public InitiateDisbursementUseCase(DisbursementRepository repo, FundTransferPort ftPort) { this.repo = repo; this.ftPort = ftPort; }
    public DisbursementResponse execute(DisbursementRequest req) {
        LoanDisbursement disb = LoanDisbursement.builder().applicationId(req.applicationId()).disbursementType(req.disbursementType()).status(DisbursementStatus.DISBURSEMENT_INITIATED).disbursementAmount(req.amount()).beneficiaryName(req.beneficiaryName()).beneficiaryAccountNumber(req.beneficiaryAccountNumber()).beneficiaryIfscCode(req.beneficiaryIfscCode()).build();
        FundTransferResult result = ftPort.transfer(new FundTransferRequest(req.beneficiaryName(), req.beneficiaryAccountNumber(), req.beneficiaryIfscCode(), req.amount(), "HLMS Disbursement", "HLMS-" + req.applicationId()));
        if (result.success()) { disb.setStatus(DisbursementStatus.DISBURSEMENT_COMPLETED); disb.setUtrNumber(result.utrNumber()); disb.setDisbursementDate(LocalDate.now()); }
        else { disb.setStatus(DisbursementStatus.FAILED); throw new BusinessRuleViolationException(ErrorCodes.DISBURSEMENT_FUND_TRANSFER_FAILED, result.errorMessage()); }
        LoanDisbursement saved = repo.save(disb);
        return new DisbursementResponse(saved.getId(), saved.getApplicationId(), saved.getStatus().name(), saved.getDisbursementAmount(), saved.getUtrNumber(), saved.getDisbursementDate());
    }
}
