package com.hlms.domain.collection.port.outbound;
import com.hlms.common.util.enums.NpaCategory;
import com.hlms.domain.collection.entity.LoanNpa;
import java.util.List;
import java.util.Optional;
public interface NpaRepository { LoanNpa save(LoanNpa npa); Optional<LoanNpa> findByLoanAccountId(Long loanAccountId); List<LoanNpa> findByNpaCategory(NpaCategory category); List<LoanNpa> findAllActiveNpas(); }
