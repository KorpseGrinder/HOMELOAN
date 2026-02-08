package com.hlms.domain.property.entity;
import com.hlms.common.util.enums.TitleStatus;
import lombok.*;
import java.time.LocalDate;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PropertyLegalOpinion {
    private Long id; private Long propertyId; private String advocateName; private String advocateRegNumber;
    private TitleStatus titleStatus; private boolean encumbranceFree; private boolean litigationFree;
    private String opinionSummary; private LocalDate opinionDate; private String remarks;
}
