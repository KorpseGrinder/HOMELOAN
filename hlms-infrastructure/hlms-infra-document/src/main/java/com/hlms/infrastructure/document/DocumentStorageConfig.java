package com.hlms.infrastructure.document;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "hlms.document.storage")
public record DocumentStorageConfig(
    String basePath,
    long maxFileSizeBytes,
    String allowedExtensions
) {
    public DocumentStorageConfig {
        if (basePath == null || basePath.isBlank()) basePath = "/tmp/hlms/documents";
        if (maxFileSizeBytes <= 0) maxFileSizeBytes = 10_485_760L; // 10 MB
        if (allowedExtensions == null) allowedExtensions = "pdf,jpg,jpeg,png,doc,docx";
    }
}
