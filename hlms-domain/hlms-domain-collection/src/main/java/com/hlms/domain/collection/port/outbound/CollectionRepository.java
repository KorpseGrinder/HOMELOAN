package com.hlms.domain.collection.port.outbound;
import com.hlms.common.util.enums.CaseStatus;
import com.hlms.common.util.enums.CollectionBucket;
import com.hlms.domain.collection.entity.CollectionCase;
import java.util.List;
import java.util.Optional;
public interface CollectionRepository { CollectionCase save(CollectionCase c); Optional<CollectionCase> findById(Long id); Optional<CollectionCase> findByLoanAccountId(Long loanAccountId); List<CollectionCase> findByBucket(CollectionBucket bucket); List<CollectionCase> findByStatus(CaseStatus status); List<CollectionCase> findByAssignedTo(String userId); }
