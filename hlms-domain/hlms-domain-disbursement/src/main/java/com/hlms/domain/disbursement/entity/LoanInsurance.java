package com.hlms.domain.disbursement.entity;
import com.hlms.common.util.enums.InsuranceType;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoanInsurance { private Long id; private Long applicationId; private InsuranceType insuranceType; private String policyNumber; private String insurerName; private BigDecimal coverAmount; private BigDecimal premiumAmount; private LocalDate startDate; private LocalDate endDate; private boolean active; }
