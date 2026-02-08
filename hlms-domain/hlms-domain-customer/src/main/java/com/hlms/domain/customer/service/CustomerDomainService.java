package com.hlms.domain.customer.service;

import com.hlms.common.util.enums.DocumentType;
import com.hlms.common.util.enums.KycStatus;
import com.hlms.common.util.enums.RelationshipType;
import com.hlms.domain.customer.entity.Customer;
import com.hlms.domain.customer.entity.CustomerIncome;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

public class CustomerDomainService {

    /**
     * Calculate total monthly income with co-applicant income clubbing.
     * Weightage: Spouse 100%, Parent/Child 50%, Sibling 25%, Other 0%
     *
     * @param primaryApplicant the primary loan applicant
     * @param coApplicants     list of co-applicant customers
     * @param relationships    map of co-applicant ID to their relationship with primary
     * @return total clubbed monthly income
     */
    public BigDecimal calculateClubbedIncome(Customer primaryApplicant,
                                              List<Customer> coApplicants,
                                              Map<Long, RelationshipType> relationships) {
        BigDecimal totalIncome = calculateNetMonthlyIncome(primaryApplicant);

        for (Customer coApp : coApplicants) {
            RelationshipType relationship = relationships.get(coApp.getId());
            BigDecimal weightage = getIncomeWeightage(relationship);
            BigDecimal coAppIncome = calculateNetMonthlyIncome(coApp)
                .multiply(weightage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            totalIncome = totalIncome.add(coAppIncome);
        }
        return totalIncome;
    }

    /**
     * Calculates the total net monthly income from all verified income sources.
     *
     * @param customer the customer whose income is to be calculated
     * @return total verified net monthly income
     */
    public BigDecimal calculateNetMonthlyIncome(Customer customer) {
        if (customer.getIncomes() == null || customer.getIncomes().isEmpty()) {
            return BigDecimal.ZERO;
        }
        return customer.getIncomes().stream()
            .filter(CustomerIncome::isVerified)
            .map(CustomerIncome::getNetMonthlyIncome)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Returns the income weightage percentage based on the relationship type.
     *
     * @param relationship the relationship type of the co-applicant
     * @return weightage as a percentage (100, 50, 25, or 0)
     */
    public BigDecimal getIncomeWeightage(RelationshipType relationship) {
        return switch (relationship) {
            case SPOUSE -> BigDecimal.valueOf(100);
            case PARENT, CHILD -> BigDecimal.valueOf(50);
            case SIBLING -> BigDecimal.valueOf(25);
            default -> BigDecimal.ZERO;
        };
    }

    /**
     * Checks if the customer has completed mandatory KYC (PAN, Aadhaar, Photograph all verified).
     *
     * @param customer the customer to check
     * @return true if all mandatory KYC documents are verified
     */
    public boolean isKycComplete(Customer customer) {
        if (customer.getKycDocuments() == null) {
            return false;
        }
        boolean hasPan = customer.getKycDocuments().stream()
            .anyMatch(k -> k.getDocumentType() == DocumentType.PAN_CARD
                        && k.getVerificationStatus() == KycStatus.VERIFIED);
        boolean hasAadhaar = customer.getKycDocuments().stream()
            .anyMatch(k -> k.getDocumentType() == DocumentType.AADHAAR_CARD
                        && k.getVerificationStatus() == KycStatus.VERIFIED);
        boolean hasPhoto = customer.getKycDocuments().stream()
            .anyMatch(k -> k.getDocumentType() == DocumentType.PHOTOGRAPH
                        && k.getVerificationStatus() == KycStatus.VERIFIED);
        return hasPan && hasAadhaar && hasPhoto;
    }

    /**
     * Checks if the customer is within the eligible age range.
     *
     * @param customer the customer to check
     * @param minAge   minimum eligible age
     * @param maxAge   maximum eligible age
     * @return true if the customer''s age is within the specified range
     */
    public boolean isEligibleByAge(Customer customer, int minAge, int maxAge) {
        int age = customer.getAge();
        return age >= minAge && age <= maxAge;
    }
}
