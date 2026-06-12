package com.voltway.backend.voltway.service;

import com.voltway.backend.voltway.model.Booking;
import com.voltway.backend.voltway.model.ChargingStation;
import com.voltway.backend.voltway.model.Notification;
import com.voltway.backend.voltway.model.User;
import com.voltway.backend.voltway.repository.BookingRepository;
import com.voltway.backend.voltway.repository.ChargingStationRepository;
import com.voltway.backend.voltway.repository.NotificationRepository;
import com.voltway.backend.voltway.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChargingStationRepository stationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Booking> getUserBookings(String userEmail) {
        // No need to look up user by email first, just get bookings directly
        return bookingRepository.findByUserEmail(userEmail);
    }

    public List<Booking> getHostBookings(String hostEmail) {
        // No need to look up host by email first, just get bookings directly
        return bookingRepository.findByHostEmail(hostEmail);
    }

    public Booking createBooking(String userEmail, String stationId) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Optional<ChargingStation> stationOpt = stationRepository.findById(stationId);
        if (stationOpt.isEmpty()) {
            throw new RuntimeException("Station not found");
        }

        ChargingStation station = stationOpt.get();
        if (!station.isApproved() || !station.isActive()) {
            throw new RuntimeException("Station is not available for booking");
        }

        String hostEmail = station.getEmail();

        Booking booking = new Booking();
        booking.setUserEmail(userEmail);
        booking.setHostEmail(hostEmail);
        booking.setStationId(stationId);
        booking.setStationName(station.getStationName());
        booking.setBookingTime(LocalDateTime.now());
        booking.setStatus("pending");
        booking.setPaymentStatus("awaiting_approval");

        Booking savedBooking = bookingRepository.save(booking);


        Notification notification = new Notification();
        notification.setRecipientId(hostEmail); // Use email directly
        notification.setSenderId(userEmail);

        Optional<User> user = userRepository.findByEmail(userEmail);
        String senderName = user.isPresent() ?
                user.get().getFirstName() + " " + user.get().getLastName() : "A user";

        notification.setSenderName(senderName);
        notification.setMessage("New booking request for your station: " + station.getStationName());
        notification.setType("booking_request");
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notification.setEmail(hostEmail); // Ensure email is set correctly

        notificationRepository.save(notification);

        return savedBooking;
    }


    public Booking approveBooking(String bookingId, String hostEmail) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();

        // Verify this booking belongs to the host
        if (!booking.getHostEmail().equals(hostEmail)) {
            throw new RuntimeException("You don't have permission to update this booking");
        }

        // Update booking status to approved
        booking.setStatus("approved");
        booking.setPaymentStatus("pending"); // Now set to pending for payment

        Booking updatedBooking = bookingRepository.save(booking);

        // Notify the EV owner that booking is approved and payment is required
        String userEmail = booking.getUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        Optional<User> hostOpt = userRepository.findByEmail(hostEmail);

        if (userOpt.isPresent() && hostOpt.isPresent()) {
            User user = userOpt.get();
            User host = hostOpt.get();

            Notification notification = new Notification();
            notification.setRecipientId(userEmail);
            notification.setSenderId(hostEmail);
            notification.setSenderName(host.getFirstName() + " " + host.getLastName());
            notification.setMessage("Your booking request for station: " + booking.getStationName() +
                    " has been approved. Please proceed with payment.");
            notification.setType("booking_approved");
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);
            notification.setEmail(userEmail);

            notificationRepository.save(notification);
        }

        return updatedBooking;
    }

    public Booking completeCharging(String bookingId, String hostEmail) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();

        // Verify this booking belongs to the host
        if (!booking.getHostEmail().equals(hostEmail)) {
            throw new RuntimeException("You don't have permission to update this booking");
        }

        // Set booking as completed and calculate amount
        booking.setChargingEndTime(LocalDateTime.now());
        booking.setStatus("completed");

        // Calculate charging time and amount (simplified for demo)
        if (booking.getChargingStartTime() != null) {
            long minutes = java.time.Duration.between(booking.getChargingStartTime(), booking.getChargingEndTime()).toMinutes();
            // Assuming a rate of $0.25 per minute for charging
            double amount = Math.max(minutes * 0.25, 5.0); // minimum $5.00
            booking.setAmount(amount);
        } else {
            // If no start time was recorded, use a default amount
            booking.setAmount(15.0);
        }

        Booking updatedBooking = bookingRepository.save(booking);

        // Notify the EV owner that charging is completed and payment is due
        String userEmail = booking.getUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        Optional<User> hostOpt = userRepository.findByEmail(hostEmail);

        if (userOpt.isPresent() && hostOpt.isPresent()) {
            User user = userOpt.get();
            User host = hostOpt.get();

            Notification notification = new Notification();
            notification.setRecipientId(userEmail); // Use email as ID
            notification.setSenderId(hostEmail); // Use email as ID
            notification.setSenderName(host.getFirstName() + " " + host.getLastName());
            notification.setMessage("Charging completed at station: " + booking.getStationName() +
                    ". Amount due: $" + String.format("%.2f", booking.getAmount()));
            notification.setType("payment_request");
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);  // Changed from isRead to read
            notification.setEmail(userEmail);

            notificationRepository.save(notification);
        }

        return updatedBooking;
    }

    public Booking processPayment(String bookingId, String userEmail, String transactionId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();

        // Verify this booking belongs to the user
        if (!booking.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("You don't have permission to update this booking");
        }

        // Update booking payment status
        booking.setPaymentStatus("paid");
        booking.setPaymentTransactionId(transactionId);

        Booking updatedBooking = bookingRepository.save(booking);

        // Notify the host that payment was received
        String hostEmail = booking.getHostEmail();
        Optional<User> hostOpt = userRepository.findByEmail(hostEmail);
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (hostOpt.isPresent() && userOpt.isPresent()) {
            User host = hostOpt.get();
            User user = userOpt.get();

            Notification notification = new Notification();
            notification.setRecipientId(hostEmail); // Use email as ID
            notification.setSenderId(userEmail); // Use email as ID
            notification.setSenderName(user.getFirstName() + " " + user.getLastName());
            notification.setMessage("Payment received for booking at station: " + booking.getStationName() +
                    ". Amount: $" + String.format("%.2f", booking.getAmount()));
            notification.setType("payment_received");
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);  // Changed from isRead to read
            notification.setEmail(hostEmail);

            notificationRepository.save(notification);
        }

        return updatedBooking;
    }

    public Booking startCharging(String bookingId, String hostEmail) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found");
        }

        Booking booking = bookingOpt.get();

        // Verify this booking belongs to the host
        if (!booking.getHostEmail().equals(hostEmail)) {
            throw new RuntimeException("You don't have permission to update this booking");
        }

        // Update booking status
        booking.setStatus("active");
        booking.setChargingStartTime(LocalDateTime.now());

        Booking updatedBooking = bookingRepository.save(booking);

        // Notify the EV owner that charging has started
        String userEmail = booking.getUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        Optional<User> hostOpt = userRepository.findByEmail(hostEmail);

        if (userOpt.isPresent() && hostOpt.isPresent()) {
            User user = userOpt.get();
            User host = hostOpt.get();

            Notification notification = new Notification();
            notification.setRecipientId(userEmail); // Use email as ID
            notification.setSenderId(hostEmail); // Use email as ID
            notification.setSenderName(host.getFirstName() + " " + host.getLastName());
            notification.setMessage("Charging has started at station: " + booking.getStationName());
            notification.setType("charging_started");
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);  // Changed from isRead to read
            notification.setEmail(userEmail);

            notificationRepository.save(notification);
        }

        return updatedBooking;
    }


    public Optional<Booking> findBookingById(String bookingId) {
        return bookingRepository.findById(bookingId);
    }
}