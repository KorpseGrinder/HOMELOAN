package com.hlms.infrastructure.persistence.repository;
import com.hlms.infrastructure.persistence.entity.customer.CustomerJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface CustomerJpaRepository extends JpaRepository<CustomerJpaEntity, Long> { Optional<CustomerJpaEntity> findByPanNumber(String pan); Optional<CustomerJpaEntity> findByMobileNumber(String mobile); }
