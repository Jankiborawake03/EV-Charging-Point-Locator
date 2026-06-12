package com.voltway.backend.voltway.service;

import com.voltway.backend.voltway.model.ChargingStation;
import com.voltway.backend.voltway.model.Notification;
import com.voltway.backend.voltway.model.NotificationRequest;
import com.voltway.backend.voltway.model.User;
import com.voltway.backend.voltway.repository.ChargingStationRepository;
import com.voltway.backend.voltway.repository.NotificationRepository;
import com.voltway.backend.voltway.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChargingStationService {

    private final ChargingStationRepository repository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;


    public ChargingStationService(ChargingStationRepository repository) {
        this.repository = repository;
    }

    public List<ChargingStation> getStationsNearby(double lat, double lon, double radius) {
        return repository.findByApprovedTrue().stream()
                .filter(station -> station.isActive())
                .filter(station -> calculateDistance(lat, lon, station.getLatitude(), station.getLongitude()) <= radius)
                .collect(Collectors.toList());
    }

    public Optional<ChargingStation> findStationById(String stationId) {

        return repository.findById(stationId);
    }

    public List<ChargingStation> findStationByEmail(String email) {

        return repository.findByEmail(email);
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {

        final double R = 6371.0710;


        double radLat1 = Math.toRadians(lat1);
        double radLon1 = Math.toRadians(lon1);
        double radLat2 = Math.toRadians(lat2);
        double radLon2 = Math.toRadians(lon2);


        double dLat = radLat2 - radLat1;
        double dLon = radLon2 - radLon1;


        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(radLat1) * Math.cos(radLat2) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));


        double adjustmentFactor = 1.2;

        return R * c * adjustmentFactor;
    }

    public String notifyStationHostByEmail(String email, NotificationRequest request) {
        System.out.println("Notifying station host with email: " + email);

        try {
            if (request.getEmail() == null || request.getEmail().isEmpty() ||
                    request.getMessage() == null || request.getMessage().isEmpty()) {
                System.out.println("Error: Missing required fields in notification request");
                return null;
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                System.out.println("Error: User not found with email: " + email);
                return null;
            }

            User user = userOpt.get();

            Notification notification = new Notification();
            notification.setRecipientId(email);
            notification.setSenderId(request.getEmail());
            notification.setSenderName(request.getUserName() != null && !request.getUserName().trim().isEmpty() ?
                    request.getUserName() : "User");
            notification.setMessage(request.getMessage());
            notification.setType(request.getRequestType() != null ?
                    request.getRequestType() : "charging_request");
            notification.setCreatedAt(LocalDateTime.now());
            notification.setRead(false);
            notification.setEmail(email);
            notification.setActionBy("");
            notification.setStatus("Pending");
            notification.setResponseMessage("");
            notification.setRespondedAt(null);

            Notification savedNotification = notificationRepository.save(notification);
            if (savedNotification != null && savedNotification.getId() != null) {

                String subject = "⚡ Booking Request Received";
                String text = "Hello " + user.getFirstName() + " " + user.getLastName() + ",\n\n"
                + "You have received a new booking request from: " + request.getUserName() + "\n"
                        + "Message: " + request.getMessage() + "\n\n"
                        + "Please login to your host panel to respond within 10 minutes.\n\n"
                        + "Regards,\nVoltWay Team";

                emailService.sendEmail(email, subject, text);

                System.out.println("Notification and email sent successfully with ID: " + savedNotification.getId());
                return savedNotification.getId();
            } else {
                System.out.println("Error: Failed to save notification");
                return null;
            }
        } catch (Exception e) {
            System.err.println("Error in notifyStationHostByEmail: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }



    public ChargingStation toggleStationStatus(String stationId) {
        Optional<ChargingStation> stationOptional = repository.findById(stationId);
        if (stationOptional.isPresent()) {
            ChargingStation station = stationOptional.get();
            station.setActive(!station.isActive());
            return repository.save(station);
        }
        return null;
    }
}