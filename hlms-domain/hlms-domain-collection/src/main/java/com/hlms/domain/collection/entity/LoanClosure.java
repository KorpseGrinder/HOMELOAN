package com.hlms.domain.collection.entity;
import com.hlms.common.util.enums.ClosureType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoanClosure { private Long id; private Long loanAccountId; private ClosureType closureType; private BigDecimal closingBalance; private BigDecimal waiverAmount; private LocalDate closureDate; private LocalDate documentReturnDate; private LocalDate documentReturnDueDate; private BigDecimal documentReturnPenalty; private boolean nocGenerated; private LocalDate nocDate; private boolean cersaiSatisfied; }
