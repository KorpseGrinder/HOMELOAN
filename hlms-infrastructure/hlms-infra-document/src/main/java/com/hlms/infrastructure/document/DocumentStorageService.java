package com.hlms.infrastructure.document;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DocumentStorageService {

    private static final Logger log = LoggerFactory.getLogger(DocumentStorageService.class);
    private final DocumentStorageConfig config;

    public DocumentStorageService(DocumentStorageConfig config) {
        this.config = config;
    }

    public StoredDocument store(String originalFileName, String contentType, InputStream inputStream) throws IOException {
        String extension = getExtension(originalFileName);
        String storedFileName = UUID.randomUUID() + "." + extension;
        Path targetDir = Paths.get(config.basePath());
        Files.createDirectories(targetDir);
        Path targetFile = targetDir.resolve(storedFileName);

        long size = Files.copy(inputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);
        log.info("Stored document: {} as {} ({} bytes)", originalFileName, storedFileName, size);

        return new StoredDocument(storedFileName, originalFileName, targetFile.toString(), contentType, size, LocalDateTime.now());
    }

    public byte[] retrieve(String fileName) throws IOException {
        Path filePath = Paths.get(config.basePath()).resolve(fileName);
        return Files.readAllBytes(filePath);
    }

    public boolean delete(String fileName) throws IOException {
        Path filePath = Paths.get(config.basePath()).resolve(fileName);
        return Files.deleteIfExists(filePath);
    }

    private String getExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        return lastDot > 0 ? fileName.substring(lastDot + 1).toLowerCase() : "dat";
    }
}
