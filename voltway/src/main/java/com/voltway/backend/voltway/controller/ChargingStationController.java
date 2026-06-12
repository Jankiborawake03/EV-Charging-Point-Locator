package com.voltway.backend.voltway.controller;

import com.voltway.backend.voltway.model.Booking;
import com.voltway.backend.voltway.model.ChargingStation;
import com.voltway.backend.voltway.model.Notification;
import com.voltway.backend.voltway.model.NotificationRequest;
import com.voltway.backend.voltway.service.BookingService;
import com.voltway.backend.voltway.service.ChargingStationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/fetch-stations")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class ChargingStationController {

    private final ChargingStationService service;

    @Autowired
    private BookingService bookingService;

    public ChargingStationController(ChargingStationService service) {
        this.service = service;
    }

    @GetMapping("/nearby")
    public List<ChargingStation> getNearbyStations(
            @RequestParam double lat, @RequestParam double lon,
            @RequestParam(defaultValue = "5") double radius) {
        return service.getStationsNearby(lat, lon, radius);
    }

    @GetMapping("/find")
    public ResponseEntity<?> findStationByEmail(
            @RequestParam(required = false) String stationId,
            @RequestParam(required = false) String email) {

        if (stationId == null && email == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Either stationId or email must be provided"));
        }

        try {
            if (stationId != null) {
                Optional<ChargingStation> station = service.findStationById(stationId);
                return station.map(ResponseEntity::ok)
                        .orElseGet(() -> ResponseEntity.notFound().build());
            } else {
                List<ChargingStation> stations = service.findStationByEmail(email);
                if (stations.isEmpty()) {
                    return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(stations);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/notify-host")
    public ResponseEntity<?> notifyStationHostByEmail(
            @RequestParam(required = true) String stationId,
            @RequestBody NotificationRequest notification) {

        System.out.println("Received notification request for stationId: " + stationId);
        System.out.println("Notification request: " + notification);



        try {

            if (stationId == null || stationId.trim().isEmpty()) {
                System.out.println("Error: Station ID is missing or empty");
                return ResponseEntity.badRequest().body(Map.of("error", "Station ID is required for notification"));
            }

            if (notification == null || notification.getEmail() == null) {
                System.out.println("Error: Invalid notification request data");
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid notification request data"));
            }


            Optional<ChargingStation> stationOptional = service.findStationById(stationId);
            if (stationOptional.isEmpty()) {
                System.out.println("Error: Station not found with ID: " + stationId);
                return ResponseEntity.badRequest().body(Map.of("error", "Station not found with ID: " + stationId));
            }


            String hostEmail = stationOptional.get().getEmail();
            System.out.println("Found station host email: " + hostEmail);

            if (hostEmail == null || hostEmail.isEmpty()) {
                System.out.println("Error: Host email is missing");
                return ResponseEntity.badRequest().body(Map.of("error", "Station host email not found"));
            }


            String id = service.notifyStationHostByEmail(hostEmail, notification);
            if (id!=null) {
                System.out.println("Notification sent successfully");
                return ResponseEntity.ok(Map.of(
                        "message", "Notification sent successfully, please wait for approval",
                        "notificationId", id
                ));
            } else {
                System.out.println("Error: Failed to send notification");
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to send notification"));
            }
        } catch (Exception e) {
            System.out.println("Exception in notifyStationHostByEmail: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send notification: " + e.getMessage()));
        }
    }



    @PostMapping("/process-payment")
    public ResponseEntity<?> processPayment(@RequestBody Map<String, Object> paymentDetails) {
        try {

            String bookingId = (String) paymentDetails.get("bookingId");

            if (bookingId != null) {

                Optional<Booking> bookingOpt = bookingService.findBookingById(bookingId);
                if (bookingOpt.isPresent()) {
                    Booking booking = bookingOpt.get();


                    if (!"approved".equals(booking.getStatus())) {
                        return ResponseEntity.badRequest().body(Map.of(
                                "success", false,
                                "message", "Payment cannot be processed until booking is approved by host"
                        ));
                    }
                }
            }
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "transactionId", "TX" + System.currentTimeMillis(),
                    "message", "Payment processed successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Payment processing failed: " + e.getMessage()));
        }
    }

    @PutMapping("/toggle-status/{stationId}")
    public ResponseEntity<?> toggleStationStatus(@PathVariable String stationId, Principal principal) {
        try {

            Optional<ChargingStation> stationOptional = service.findStationById(stationId);
            if (stationOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            ChargingStation station = stationOptional.get();
            if (!station.getEmail().equals(principal.getName())) {
                return ResponseEntity.status(403).body(Map.of("error", "You don't have permission to modify this station"));
            }

            ChargingStation updatedStation = service.toggleStationStatus(stationId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "isActive", updatedStation.isActive(),
                    "message", updatedStation.isActive() ? "Station activated successfully" : "Station deactivated successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to toggle station status: " + e.getMessage()));
        }
    }
}