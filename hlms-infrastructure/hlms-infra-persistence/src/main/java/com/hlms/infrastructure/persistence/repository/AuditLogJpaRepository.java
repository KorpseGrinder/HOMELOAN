package com.hlms.infrastructure.persistence.repository;

import com.hlms.infrastructure.persistence.entity.admin.AuditLogJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogJpaRepository extends JpaRepository<AuditLogJpaEntity, Long> {
}
