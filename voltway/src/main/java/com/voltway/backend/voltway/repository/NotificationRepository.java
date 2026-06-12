package com.voltway.backend.voltway.repository;

import com.voltway.backend.voltway.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);
    List<Notification> findByRecipientIdAndReadFalse(String recipientId);
    int countByRecipientIdAndReadFalse(String recipientId);

    List<Notification> findByEmailOrderByCreatedAtDesc(String email);
    int countByEmailAndReadFalse(String email);
    List<Notification> findByEmailAndReadFalse(String email);



    List<Notification> findBySenderIdOrderByCreatedAtDesc(String senderId);
    List<Notification> findBySenderIdOrEmailOrderByCreatedAtDesc(String senderId, String email);
}