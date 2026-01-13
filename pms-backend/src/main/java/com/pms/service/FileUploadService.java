package com.pms.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class FileUploadService {
    
    @Value("${file.upload.dir:uploads}")
    private String uploadDir;
    
    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        
        // Create uploads directory if it doesn't exist
        File uploadFolder = new File(uploadDir);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        // Save file
        Path filePath = Paths.get(uploadDir, uniqueFilename);
        Files.write(filePath, file.getBytes());
        
        log.info("File uploaded successfully: {}", uniqueFilename);
        return uniqueFilename; // Return just the filename, not the full path
    }
    
    public File getFile(String filename) {
        return new File(Paths.get(uploadDir, filename).toString());
    }
    
    public void deleteFile(String filename) {
        try {
            if (filename != null && !filename.isEmpty()) {
                Path filePath = Paths.get(uploadDir, filename);
                Files.deleteIfExists(filePath);
                log.info("File deleted: {}", filename);
            }
        } catch (IOException e) {
            log.error("Error deleting file: {}", filename, e);
        }
    }
}
