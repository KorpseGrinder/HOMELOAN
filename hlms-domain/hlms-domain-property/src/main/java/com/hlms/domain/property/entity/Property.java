package com.hlms.domain.property.entity;
import com.hlms.common.util.enums.PropertyConstructionStatus;
import com.hlms.common.util.enums.PropertyType;
import lombok.*;
import java.math.BigDecimal;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Property {
    private Long id; private Long applicationId; private PropertyType propertyType; private PropertyConstructionStatus constructionStatus;
    private String addressLine1; private String addressLine2; private String city; private String state; private String pincode;
    private BigDecimal carpetAreaSqft; private BigDecimal builtUpAreaSqft; private BigDecimal superBuiltUpAreaSqft;
    private String projectName; private String builderName; private String surveyNumber; private Integer yearOfConstruction;
    private boolean approvedByAuthority; private String approvalAuthority;
}
