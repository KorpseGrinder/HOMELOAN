package com.hlms.domain.customer.entity;

import com.hlms.common.util.base.BaseEntity;
import com.hlms.common.util.enums.CustomerCategory;
import com.hlms.common.util.enums.CustomerType;
import com.hlms.common.util.enums.Gender;
import com.hlms.common.util.enums.KycStatus;
import com.hlms.common.util.enums.MaritalStatus;
import com.hlms.common.util.enums.ResidentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Customer extends BaseEntity {

    private String customerNumber;
    private CustomerType customerType;
    private String firstName;
    private String middleName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String panEncrypted;
    private String aadhaarHash;
    private String email;
    private String mobile;
    private String alternateMobile;
    private ResidentStatus residentStatus;
    private MaritalStatus maritalStatus;
    private CustomerCategory category;
    private Integer numberOfDependents;
    private String fatherName;
    private String spouseName;
    private String nationality;
    private Integer cibilScore;
    private KycStatus kycStatus;
    private boolean active;

    private List<CustomerAddress> addresses;
    private List<CustomerEmployment> employments;
    private List<CustomerIncome> incomes;
    private List<CustomerKyc> kycDocuments;
    private List<CustomerBankAccount> bankAccounts;

    /**
     * Returns the full name by concatenating first, middle (if present), and last name.
     */
    public String getFullName() {
        StringBuilder sb = new StringBuilder(firstName);
        if (middleName != null && !middleName.isBlank()) {
            sb.append(" ").append(middleName);
        }
        sb.append(" ").append(lastName);
        return sb.toString();
    }

    /**
     * Calculates the age of the customer based on date of birth.
     */
    public int getAge() {
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }
}
