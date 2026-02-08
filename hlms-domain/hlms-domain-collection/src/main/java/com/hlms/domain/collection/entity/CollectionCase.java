package com.hlms.domain.collection.entity;
import com.hlms.common.util.enums.CaseStatus;
import com.hlms.common.util.enums.CollectionBucket;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CollectionCase { private Long id; private Long loanAccountId; private CollectionBucket bucket; private CaseStatus status; private String assignedTo; private Integer dpd; private BigDecimal totalOverdueAmount; private BigDecimal principalOverdue; private BigDecimal interestOverdue; private BigDecimal penaltyAmount; private LocalDate nextFollowUpDate; private String remarks; }
