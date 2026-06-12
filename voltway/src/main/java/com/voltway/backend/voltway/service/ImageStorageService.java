package com.voltway.backend.voltway.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;


@Service
public class ImageStorageService {
    private static final String UPLOAD_DIR = "uploads/";

    public String storeImage(MultipartFile file) throws IOException {
        if (file.getSize() > 50 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds 50MB limit");
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + filename);

        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());

        return "http://localhost:8080/uploads/" + filename;
    }
}
