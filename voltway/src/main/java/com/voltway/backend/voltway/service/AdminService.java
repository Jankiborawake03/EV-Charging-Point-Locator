package com.voltway.backend.voltway.service;

import com.voltway.backend.voltway.DTO.AdminSignupDto;
import com.voltway.backend.voltway.DTO.AdminLoginDto;
import com.voltway.backend.voltway.DTO.DuplicateEmailException;
import com.voltway.backend.voltway.DTO.InvalidCredentialsException;
import com.voltway.backend.voltway.model.Admin;
import com.voltway.backend.voltway.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Admin registerAdmin(AdminSignupDto signupDto) {
               if (adminRepository.existsByEmail(signupDto.getEmail())) {
            throw new DuplicateEmailException("Email already registered");
        }


        Admin admin = new Admin();
        admin.setFirstName(signupDto.getFirstName());
        admin.setLastName(signupDto.getLastName());
        admin.setContactNumber(signupDto.getContactNumber());
        admin.setEmail(signupDto.getEmail());
        admin.setPassword(passwordEncoder.encode(signupDto.getPassword()));

        return adminRepository.save(admin);
    }

    public Admin authenticateAdmin(AdminLoginDto loginDto) {

        Admin admin = adminRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));


        if (!passwordEncoder.matches(loginDto.getPassword(), admin.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }


        Admin adminResponse = new Admin();
        adminResponse.setId(admin.getId());
        adminResponse.setFirstName(admin.getFirstName());
        adminResponse.setLastName(admin.getLastName());
        adminResponse.setEmail(admin.getEmail());
        adminResponse.setContactNumber(admin.getContactNumber());


        return adminResponse;
    }
}