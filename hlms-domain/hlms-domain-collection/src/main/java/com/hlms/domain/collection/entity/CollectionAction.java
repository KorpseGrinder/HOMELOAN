package com.hlms.domain.collection.entity;
import com.hlms.common.util.enums.CollectionActionType;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CollectionAction { private Long id; private Long caseId; private CollectionActionType actionType; private String performedBy; private LocalDateTime actionDate; private String description; private String outcome; private LocalDateTime nextFollowUpDate; }
