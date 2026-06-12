package com.voltway.backend.voltway.controller;



import com.voltway.backend.voltway.model.Notification;
import com.voltway.backend.voltway.model.NotificationResponse;
import com.voltway.backend.voltway.repository.ChargingStationRepository;
import com.voltway.backend.voltway.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:4200")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ChargingStationRepository chargingStationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Principal principal) {
        List<Notification> notifications = notificationService.getUserNotifications(principal.getName());
        return ResponseEntity.ok(notifications);
    }

    // Make sure you have this endpoint in NotificationController.java
    @GetMapping("/recipient/{recipientId}/unread-count")
    public ResponseEntity<Map<String, Integer>> getUnreadNotificationCountByRecipient(@PathVariable String recipientId) {
        int count = notificationService.getUnreadNotificationsByRecipientId(recipientId).size();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(Map.of("message", "Notification marked as read"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllNotificationsAsRead(Principal principal) {
        notificationService.markAllAsRead(principal.getName());
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @GetMapping("/recipient/{recipientId}")
    public ResponseEntity<List<Notification>> getNotificationsByRecipientId(@PathVariable String recipientId) {
        List<Notification> notifications = notificationService.getNotificationsByRecipientId(recipientId);
        return ResponseEntity.ok(notifications);
    }


    @GetMapping("/sender/{senderId}")
    public ResponseEntity<List<Notification>> getNotificationsBySenderId(@PathVariable String senderId) {
        List<Notification> notifications = notificationService.getNotificationsBySenderId(senderId);
        return ResponseEntity.ok(notifications);
    }

    // Get notifications where senderId matches the given email (for EV Owner profile)
    @GetMapping("/sender-by-email/{email}")
    public ResponseEntity<List<Notification>> getNotificationsBySenderEmail(@PathVariable String email) {
        List<Notification> notifications = notificationService.getNotificationsBySenderEmail(email);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/recipient/{recipientId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotificationsByRecipientId(@PathVariable String recipientId) {
        List<Notification> notifications = notificationService.getUnreadNotificationsByRecipientId(recipientId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/recipient/{recipientId}/read-all")
    public ResponseEntity<?> markAllAsReadByRecipientId(@PathVariable String recipientId) {
        notificationService.markAllAsReadByRecipientId(recipientId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read for recipientId"));
    }

    @PutMapping("/{notificationId}/respond")
    public ResponseEntity<?> respondToNotification(
            @PathVariable String notificationId,
            @RequestBody NotificationResponse response) {

        String status = response.getStatus();
        String responseMessage = response.getResponseMessage();
        String actionBy = response.getActionBy();

        notificationService.respondToNotification(
                notificationId,
                status,
                responseMessage,
                actionBy
        );

        return ResponseEntity.ok(Map.of("message", "Notification response recorded"));
    }

    @GetMapping("/{notificationId}/getstatus")
    public ResponseEntity<Map<String, String>> getNotificationStatus(@PathVariable String notificationId) {
        String status = notificationService.getNotificationStatus(notificationId);
        return ResponseEntity.ok(Map.of("status", status));
    }
}