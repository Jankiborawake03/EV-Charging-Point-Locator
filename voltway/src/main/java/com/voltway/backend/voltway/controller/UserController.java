package com.voltway.backend.voltway.controller;

import com.voltway.backend.voltway.model.User;
import com.voltway.backend.voltway.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/upload-photo/{email}")
    public ResponseEntity<?> uploadProfilePhoto(
            @PathVariable String email,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            // Validate file type and size
            String[] allowedTypes = {"image/jpeg", "image/png", "image/gif", "image/webp"};
            boolean isValidType = false;
            for (String type : allowedTypes) {
                if (file.getContentType() != null && file.getContentType().equals(type)) {
                    isValidType = true;
                    break;
                }
            }

            if (!isValidType) {
                return ResponseEntity.badRequest()
                        .body("{\"error\": \"Invalid file type. Allowed types: JPEG, PNG, GIF, WebP\"}");
            }

            // Validate file size (5MB max)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body("{\"error\": \"File size should be less than 5MB\"}");
            }

            Optional<User> optionalUser = userService.getUserByEmail(email);

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                byte[] imageBytes = file.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                user.setProfilePhoto(base64Image);
                userService.saveUser(user);
                return ResponseEntity.ok()
                        .body("{\"message\": \"Profile photo updated successfully\"}");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("{\"error\": \"User not found\"}");
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error processing file\"}");
        }
    }
}