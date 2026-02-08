package com.hlms.infrastructure.persistence.repository;

import com.hlms.infrastructure.persistence.entity.admin.UserMasterJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMasterJpaRepository extends JpaRepository<UserMasterJpaEntity, Long> {
    Optional<UserMasterJpaEntity> findByUsername(String username);
}
