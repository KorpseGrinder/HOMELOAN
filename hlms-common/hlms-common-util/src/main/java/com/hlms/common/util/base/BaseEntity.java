package com.hlms.common.util.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Base entity class providing common audit fields and optimistic locking.
 * All domain entities must extend this class.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEntity {

    private Long id;
    private String createdBy;
    private LocalDateTime createdDate;
    private String modifiedBy;
    private LocalDateTime modifiedDate;
    private Long version;
}
