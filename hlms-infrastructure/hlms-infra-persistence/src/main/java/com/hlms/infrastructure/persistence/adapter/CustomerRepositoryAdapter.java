package com.hlms.infrastructure.persistence.adapter;

import com.hlms.domain.customer.entity.Customer;
import com.hlms.domain.customer.port.outbound.CustomerRepository;
import com.hlms.infrastructure.persistence.entity.customer.CustomerJpaEntity;
import com.hlms.infrastructure.persistence.repository.CustomerJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomerRepositoryAdapter implements CustomerRepository {

    private final CustomerJpaRepository repo;

    @Override
    public Customer save(Customer customer) {
        return toDomain(repo.save(toJpa(customer)));
    }

    @Override
    public Optional<Customer> findById(Long id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Customer> findByCustomerNumber(String customerNumber) {
        // TODO: Add findByCustomerNumber query to JpaRepository
        return Optional.empty();
    }

    @Override
    public Optional<Customer> findByPanHash(String panHash) {
        return repo.findByPanNumber(panHash).map(this::toDomain);
    }

    @Override
    public Optional<Customer> findByMobile(String mobile) {
        return repo.findByMobileNumber(mobile).map(this::toDomain);
    }

    @Override
    public boolean existsByPanHash(String panHash) {
        return repo.findByPanNumber(panHash).isPresent();
    }

    @Override
    public boolean existsByMobile(String mobile) {
        return repo.findByMobileNumber(mobile).isPresent();
    }

    @Override
    public List<Customer> findByBranchId(Long branchId, int page, int size) {
        // TODO: Implement with pagination and branch filtering
        return List.of();
    }

    private CustomerJpaEntity toJpa(Customer d) {
        return CustomerJpaEntity.builder()
                .id(d.getId())
                .firstName(d.getFirstName())
                .middleName(d.getMiddleName())
                .lastName(d.getLastName())
                .dateOfBirth(d.getDateOfBirth())
                .gender(d.getGender())
                .maritalStatus(d.getMaritalStatus())
                .customerType(d.getCustomerType())
                .customerCategory(d.getCategory())
                .residentStatus(d.getResidentStatus())
                .panNumber(d.getPanEncrypted())
                .aadhaarNumber(d.getAadhaarHash())
                .mobileNumber(d.getMobile())
                .email(d.getEmail())
                .createdBy(d.getCreatedBy())
                .createdDate(d.getCreatedDate())
                .modifiedBy(d.getModifiedBy())
                .modifiedDate(d.getModifiedDate())
                .version(d.getVersion())
                .build();
    }

    private Customer toDomain(CustomerJpaEntity j) {
        Customer customer = Customer.builder()
                .customerType(j.getCustomerType())
                .firstName(j.getFirstName())
                .middleName(j.getMiddleName())
                .lastName(j.getLastName())
                .dateOfBirth(j.getDateOfBirth())
                .gender(j.getGender())
                .maritalStatus(j.getMaritalStatus())
                .category(j.getCustomerCategory())
                .residentStatus(j.getResidentStatus())
                .panEncrypted(j.getPanNumber())
                .aadhaarHash(j.getAadhaarNumber())
                .mobile(j.getMobileNumber())
                .email(j.getEmail())
                .build();
        customer.setId(j.getId());
        customer.setCreatedBy(j.getCreatedBy());
        customer.setCreatedDate(j.getCreatedDate());
        customer.setModifiedBy(j.getModifiedBy());
        customer.setModifiedDate(j.getModifiedDate());
        customer.setVersion(j.getVersion());
        return customer;
    }
}
