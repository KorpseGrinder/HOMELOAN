package com.hlms.domain.customer.port.outbound;

import com.hlms.domain.customer.entity.Customer;

import java.util.List;
import java.util.Optional;

/**
 * Outbound port for Customer persistence operations.
 * Implementation resides in the infrastructure layer.
 */
public interface CustomerRepository {

    Optional<Customer> findById(Long id);

    Optional<Customer> findByCustomerNumber(String customerNumber);

    Optional<Customer> findByPanHash(String panHash);

    Optional<Customer> findByMobile(String mobile);

    Customer save(Customer customer);

    boolean existsByPanHash(String panHash);

    boolean existsByMobile(String mobile);

    List<Customer> findByBranchId(Long branchId, int page, int size);
}
