package com.hlms.domain.loan.port.outbound;
import com.hlms.common.util.enums.LoanProductType;
import com.hlms.domain.loan.entity.LoanProduct;
import java.util.List;
import java.util.Optional;
public interface LoanProductRepository { Optional<LoanProduct> findById(Long id); Optional<LoanProduct> findByProductCode(String code); List<LoanProduct> findByProductType(LoanProductType type); List<LoanProduct> findAllActive(); }
