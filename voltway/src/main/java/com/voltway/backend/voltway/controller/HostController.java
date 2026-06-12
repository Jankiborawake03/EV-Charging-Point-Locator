package com.voltway.backend.voltway.controller;

import com.voltway.backend.voltway.model.Booking;
import com.voltway.backend.voltway.model.ChargingStation;
import com.voltway.backend.voltway.model.User;
import com.voltway.backend.voltway.service.HostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/host")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class HostController {

    @Autowired
    private HostService hostService;

    // Get Host Details
    @GetMapping("/details")
    public ResponseEntity<?> getHostDetails(Principal principal, @RequestParam(required = false) String email) {
        try {
            String userEmail = getEmailFromRequest(principal, email);
            User hostDetails = hostService.getHostDetails(userEmail);
            return ResponseEntity.ok(hostDetails);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Update Host Profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Principal principal,
            @RequestParam(required = false) String email,
            @RequestBody User updatedHost
    ) {
        try {
            String userEmail = getEmailFromRequest(principal, email);
            User updatedDetails = hostService.updateHostProfile(userEmail, updatedHost);
            return ResponseEntity.ok(updatedDetails);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Upload Profile Photo - Updated to handle both multipart and base64
    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadProfilePhoto(
            Principal principal,
            @RequestParam(required = false) String email,
            @RequestBody(required = false) Map<String, String> photoData,
            @RequestParam(value = "profilePhoto", required = false) MultipartFile file
    ) {
        try {
            String userEmail = getEmailFromRequest(principal, email);
            String photoUrl;

            // If base64 data is provided in the request body
            if (photoData != null && photoData.containsKey("profilePhoto")) {
                photoUrl = hostService.uploadProfilePhoto(userEmail, photoData.get("profilePhoto"));
            }
            // If multipart file is provided
            else if (file != null) {
                photoUrl = hostService.uploadProfilePhoto(userEmail, file);
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "No profile photo data received"));
            }

            return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
        } catch (IOException e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Get Host Stations - Updated to return List<ChargingStation>
    @GetMapping("/stations")
    public ResponseEntity<?> getHostStations(
            Principal principal,
            @RequestParam(required = false) String email
    ) {
        try {
            String userEmail = getEmailFromRequest(principal, email);
            List<ChargingStation> stations = hostService.getHostStations(userEmail);
            return ResponseEntity.ok(stations);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/bookings")
    public ResponseEntity<?> getHostBookings(
            Principal principal,
            @RequestParam(required = false) String email
    ) {
        try {
            String userEmail = getEmailFromRequest(principal, email);
            System.out.println("Fetching bookings for host email: " + userEmail);
            List<Booking> bookings = hostService.getHostBookings(userEmail);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch host bookings: " + e.getMessage()));
        }
    }

    // Add New Station
    @PostMapping("/stations")
    public ResponseEntity<?> addStation(
            Principal principal,
            @RequestParam(required = false) String email,
            @RequestBody User stationDetails
    ) {
        try {
            String userEmail = getEmailFromRequest(principal, email);
            User updatedHost = hostService.addStation(userEmail, stationDetails);
            return ResponseEntity.ok(updatedHost);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Toggle Station Activation
    @PutMapping("/stations/{stationId}/toggle-activation")
    public ResponseEntity<?> toggleStationActivation(
            Principal principal,
            @RequestParam(required = false) String email,
            @PathVariable String stationId
    ) {
        try {
            String userEmail = getEmailFromRequest(principal, email);
            ChargingStation station = hostService.toggleStationActivation(stationId, userEmail);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "station", station,
                    "isActive", station.isActive(),
                    "message", station.isActive() ? "Station activated successfully" : "Station deactivated successfully"
            ));
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Complete Charging
    @PutMapping("/bookings/{bookingId}/complete")
    public ResponseEntity<?> completeCharging(
            Principal principal,
            @RequestParam(required = false) String email,
            @PathVariable String bookingId
    ) {
        try {
            String userEmail = getEmailFromRequest(principal, email);
            Booking booking = hostService.completeCharging(bookingId, userEmail);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "booking", booking,
                    "message", "Charging completed successfully. User has been notified for payment."
            ));
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // Helper method to safely extract email from Principal or request parameter
    private String getEmailFromRequest(Principal principal, String emailParam) {
        // First try from request parameter
        if (emailParam != null && !emailParam.isEmpty()) {
            System.out.println("Using email from request parameter: " + emailParam);
            return emailParam;
        }

        // Next try from principal
        if (principal != null) {
            System.out.println("Using email from principal: " + principal.getName());
            return principal.getName();
        }

        // Last try from security context
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
            System.out.println("Using email from security context: " + auth.getName());
            return auth.getName();
        }

        // If all else fails, throw exception
        throw new RuntimeException("User authentication failed. Please log in again.");
    }
}