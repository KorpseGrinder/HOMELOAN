package com.hlms.infrastructure.document;

import java.time.LocalDateTime;

public record StoredDocument(
    String fileName,
    String originalName,
    String path,
    String contentType,
    long size,
    LocalDateTime uploadedAt
) {}
