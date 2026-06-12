package com.voltway.backend.voltway.controller;

import com.voltway.backend.voltway.model.Booking;
import com.voltway.backend.voltway.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/user")
    public ResponseEntity<List<Booking>> getUserBookings(Principal principal) {
        List<Booking> bookings = bookingService.getUserBookings(principal.getName());
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/host")
    public ResponseEntity<List<Booking>> getHostBookings(Principal principal) {
        List<Booking> bookings = bookingService.getHostBookings(principal.getName());
        return ResponseEntity.ok(bookings);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestParam String stationId, Principal principal) {
        try {
            Booking booking = bookingService.createBooking(principal.getName(), stationId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Add new endpoint for approving bookings
    @PutMapping("/{bookingId}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable String bookingId, Principal principal) {
        try {
            Booking booking = bookingService.approveBooking(bookingId, principal.getName());
            return ResponseEntity.ok(Map.of(
                    "message", "Booking approved successfully",
                    "booking", booking
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{bookingId}/start")
    public ResponseEntity<?> startCharging(@PathVariable String bookingId, Principal principal) {
        try {
            Booking booking = bookingService.startCharging(bookingId, principal.getName());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{bookingId}/complete")
    public ResponseEntity<?> completeCharging(@PathVariable String bookingId, Principal principal) {
        try {
            Booking booking = bookingService.completeCharging(bookingId, principal.getName());
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{bookingId}/pay")
    public ResponseEntity<?> processPayment(
            @PathVariable String bookingId,
            @RequestBody Map<String, String> paymentInfo,
            Principal principal) {
        try {
            String transactionId = paymentInfo.getOrDefault("transactionId", "TX" + System.currentTimeMillis());
            Booking booking = bookingService.processPayment(bookingId, principal.getName(), transactionId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}