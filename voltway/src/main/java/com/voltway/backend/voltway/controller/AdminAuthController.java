package com.voltway.backend.voltway.controller;

import com.voltway.backend.voltway.DTO.AdminSignupDto;
import com.voltway.backend.voltway.DTO.AdminLoginDto;
import com.voltway.backend.voltway.DTO.ApiResponse;
import com.voltway.backend.voltway.DTO.DuplicateEmailException;
import com.voltway.backend.voltway.DTO.InvalidCredentialsException;
import com.voltway.backend.voltway.model.Admin;
import com.voltway.backend.voltway.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminAuthController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/admin-sign-up")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody AdminSignupDto signupDto) {
        try {
            Admin admin = adminService.registerAdmin(signupDto);
            return ResponseEntity.ok(new ApiResponse(true, "Admin registered successfully"));
        } catch (DuplicateEmailException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "An unexpected error occurred. Please try again."));
        }
    }

    @PostMapping("/admin-sign-in")
    public ResponseEntity<?> signInAdmin(@Valid @RequestBody AdminLoginDto loginDto) {
        try {
            Admin admin = adminService.authenticateAdmin(loginDto);
            // Return admin details for frontend storage
            return ResponseEntity.ok(admin);
        } catch (InvalidCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "An unexpected error occurred. Please try again."));
        }
    }
}