package com.hlms.infrastructure.persistence.repository;

import com.hlms.infrastructure.persistence.entity.collection.CollectionCaseJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CollectionCaseJpaRepository extends JpaRepository<CollectionCaseJpaEntity, Long> {
    Optional<CollectionCaseJpaEntity> findByAccountId(Long accountId);
    List<CollectionCaseJpaEntity> findByCollectionBucket(String bucket);
    List<CollectionCaseJpaEntity> findByCaseStatus(String status);
    List<CollectionCaseJpaEntity> findByAssignedTo(String userId);
}
