package com.voltway.backend.voltway.controller;


import com.voltway.backend.voltway.service.ForgotPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class ForgotPasswordController {
    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean success = forgotPasswordService.sendOtp(email);

        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "OTP sent to your email.");
            return ResponseEntity.ok(response); //Return JSON instead of plain text
        } else {
            response.put("message", "User not found.");
            return ResponseEntity.badRequest().body(response);
        }
    }
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        boolean success = forgotPasswordService.verifyOtp(email, otp, newPassword);

        Map<String, String> response = new HashMap<>();
        if (success) {
            response.put("message", "Password updated successfully.");
            return ResponseEntity.ok(response); //Return JSON instead of plain text
        } else {
            response.put("message", "Invalid or expired OTP.");
            return ResponseEntity.badRequest().body(response);
        }
    }
}