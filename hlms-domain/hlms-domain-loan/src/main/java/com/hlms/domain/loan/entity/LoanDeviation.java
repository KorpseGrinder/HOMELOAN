package com.hlms.domain.loan.entity;
import com.hlms.common.util.enums.DeviationSeverity;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class LoanDeviation { private Long id; private Long applicationId; private String deviationType; private String description; private DeviationSeverity severity; private boolean approved; private String approvedBy; private String approvalRemarks; private LocalDateTime approvedDate; }
