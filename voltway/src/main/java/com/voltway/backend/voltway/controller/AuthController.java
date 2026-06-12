package com.voltway.backend.voltway.controller;


import com.voltway.backend.voltway.model.User;
import com.voltway.backend.voltway.repository.UserRepository;
import com.voltway.backend.voltway.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    private final UserRepository userRepository;
    private final EmailService emailService;

    public AuthController(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // Signup for EV Owner
    @PostMapping("/signup")
    public ResponseEntity<?> registerEVOwner(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email is already registered."));
        }

        user.setRole("EV Owner");
        userRepository.save(user);
        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "EV Owner registered successfully.");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup-host")
    public ResponseEntity<?> registerHost(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email is already registered."));
        }

        user.setRole("Station Host");
        userRepository.save(user);
        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Station Host registered successfully.");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }



    @PostMapping("/signin")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent() && existingUser.get().getPassword().equals(user.getPassword())) {
            User loggedInUser = existingUser.get();

            if (!loggedInUser.getRole().equals(user.getRole())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid role. Please sign in with the correct user type."));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("firstName", loggedInUser.getFirstName());
            response.put("lastName", loggedInUser.getLastName());
            response.put("email", loggedInUser.getEmail());
            response.put("role", loggedInUser.getRole());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body(Map.of("error", "Invalid email or password"));
    }

}


