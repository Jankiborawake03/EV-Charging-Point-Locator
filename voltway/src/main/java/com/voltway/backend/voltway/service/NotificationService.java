package com.voltway.backend.voltway.service;

import com.voltway.backend.voltway.model.Notification;
import com.voltway.backend.voltway.model.User;
import com.voltway.backend.voltway.repository.NotificationRepository;
import com.voltway.backend.voltway.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Notification> getUserNotifications(String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                System.out.println("Error: User not found with email: " + email);
                throw new RuntimeException("User not found with email: " + email);
            }

            User user = userOpt.get();
            System.out.println("Fetching notifications for user email: " + email);

            // Change: Look up notifications by email instead of user ID
            List<Notification> notifications = notificationRepository.findByEmailOrderByCreatedAtDesc(email);
            System.out.println("Found " + notifications.size() + " notifications for user");
            return notifications;

        } catch (Exception e) {
            System.err.println("Error fetching user notifications: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch notifications: " + e.getMessage());
        }
    }

    public int getUnreadNotificationCount(String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                System.out.println("Error: User not found with email: " + email);
                throw new RuntimeException("User not found with email: " + email);
            }

            User user = userOpt.get();
            // Change: Count unread notifications by email instead of user ID
            int count = notificationRepository.countByEmailAndReadFalse(email);
            System.out.println("Unread notification count for user " + email + ": " + count);
            return count;

        } catch (Exception e) {
            System.err.println("Error getting unread notification count: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to get unread notification count: " + e.getMessage());
        }
    }

    public void markAllAsRead(String email) {
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                System.out.println("Error: User not found with email: " + email);
                throw new RuntimeException("User not found with email: " + email);
            }

            User user = userOpt.get();
            // Change: Find unread notifications by email instead of user ID
            List<Notification> unreadNotifications =
                    notificationRepository.findByEmailAndReadFalse(email);

            System.out.println("Marking " + unreadNotifications.size() + " notifications as read for user " + email);
            unreadNotifications.forEach(notification -> notification.setRead(true));
            notificationRepository.saveAll(unreadNotifications);
            System.out.println("Successfully marked all notifications as read");

        } catch (Exception e) {
            System.err.println("Error marking all notifications as read: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to mark all notifications as read: " + e.getMessage());
        }
    }

    public void markAsRead(String notificationId) {
        try {
            Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
            if (notificationOpt.isEmpty()) {
                System.out.println("Error: Notification not found with ID: " + notificationId);
                throw new RuntimeException("Notification not found with ID: " + notificationId);
            }

            Notification notification = notificationOpt.get();
            notification.setRead(true);
            notificationRepository.save(notification);
            System.out.println("Marked notification " + notificationId + " as read");

        } catch (Exception e) {
            System.err.println("Error marking notification as read: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to mark notification as read: " + e.getMessage());
        }
    }

    public List<Notification> getNotificationsByRecipientId(String recipientId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId);
    }

    public List<Notification> getUnreadNotificationsByRecipientId(String recipientId) {
        return notificationRepository.findByRecipientIdAndReadFalse(recipientId);
    }

    public void markAllAsReadByRecipientId(String recipientId) {
        List<Notification> unreadNotifications = notificationRepository.findByRecipientIdAndReadFalse(recipientId);
        unreadNotifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    public void respondToNotification(String notificationId, String status, String responseMessage, String actionBy) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setStatus(status);
        notification.setResponseMessage(responseMessage);
        notification.setActionBy(actionBy);
        notification.setRead(true);
        notification.setRespondedAt(new Date());

        notificationRepository.save(notification);
    }

    public String getNotificationStatus(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + notificationId));
        return notification.getStatus();
    }



    public List<Notification> getNotificationsBySenderId(String senderId) {
        return notificationRepository.findBySenderIdOrderByCreatedAtDesc(senderId);
    }

    public List<Notification> getNotificationsBySenderEmail(String email) {
        // This method finds notifications where senderId or email matches the given email
        List<Notification> notifications = notificationRepository.findBySenderIdOrEmailOrderByCreatedAtDesc(email, email);
        System.out.println("Found " + notifications.size() + " notifications for EV Owner with email: " + email);
        return notifications;
    }
}