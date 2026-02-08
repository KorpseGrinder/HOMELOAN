package com.hlms.domain.loan.port.outbound;

import com.hlms.common.util.enums.ApplicationStatus;
import com.hlms.domain.loan.entity.LoanApplication;

import java.util.List;
import java.util.Optional;

public interface LoanApplicationRepository {

    LoanApplication save(LoanApplication app);

    Optional<LoanApplication> findById(Long id);

    Optional<LoanApplication> findByApplicationNumber(String applicationNumber);

    List<LoanApplication> findByCustomerId(Long customerId);

    List<LoanApplication> findByStatus(ApplicationStatus status);

    List<LoanApplication> findByAssignedOfficerId(Long officerId);
}
