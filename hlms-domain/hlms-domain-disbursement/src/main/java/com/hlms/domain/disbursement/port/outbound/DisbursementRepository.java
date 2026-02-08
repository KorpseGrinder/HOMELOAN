package com.hlms.domain.disbursement.port.outbound;
import com.hlms.domain.disbursement.entity.LoanDisbursement;
import java.util.List;
import java.util.Optional;
public interface DisbursementRepository { LoanDisbursement save(LoanDisbursement d); Optional<LoanDisbursement> findById(Long id); List<LoanDisbursement> findByApplicationId(Long applicationId); }
