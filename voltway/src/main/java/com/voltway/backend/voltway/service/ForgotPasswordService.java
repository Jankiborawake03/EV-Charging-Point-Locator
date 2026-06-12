package com.voltway.backend.voltway.service;

import com.voltway.backend.voltway.model.User;
import com.voltway.backend.voltway.repository.UserRepository;
import com.voltway.backend.voltway.serviceinterface.ForgotPasswordServiceInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class ForgotPasswordService implements ForgotPasswordServiceInter {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Generate a random 6-digit OTP
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public boolean sendOtp(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            String otp = generateOtp();
            user.get().setOtp(otp);
            user.get().setOtpExpiry(LocalDateTime.now().plusMinutes(10)); // OTP expires in 10 minutes
            userRepository.save(user.get());

            String message = "Your OTP for password reset is: " + otp + ". It is valid for 10 minutes.";
            emailService.sendEmail(email, "Password Reset OTP", message);
            return true;
        }
        return false;
    }

    public boolean verifyOtp(String email, String otp, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            //Check if OTP exists before comparing
            if (user.getOtp() == null) {
                return false; // Return false if OTP is missing (prevents NullPointerException)
            }

            // Check if OTP is correct and not expired
            if (user.getOtp().equals(otp) && user.getOtpExpiry().isAfter(LocalDateTime.now())) {
                user.setPassword(newPassword); //  If you want hashed passwords, use passwordEncoder.encode(newPassword)
                user.setOtp(null); // Clear OTP after successful reset
                user.setOtpExpiry(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }
}
