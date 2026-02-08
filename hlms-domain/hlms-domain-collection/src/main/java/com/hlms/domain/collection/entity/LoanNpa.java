package com.hlms.domain.collection.entity;
import com.hlms.common.util.enums.NpaCategory;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoanNpa { private Long id; private Long loanAccountId; private NpaCategory npaCategory; private LocalDate npaDate; private LocalDate classificationDate; private Integer dpd; private BigDecimal outstandingAmount; private BigDecimal provisionAmount; private BigDecimal provisionPercentage; private boolean upgraded; private LocalDate upgradeDate; }
