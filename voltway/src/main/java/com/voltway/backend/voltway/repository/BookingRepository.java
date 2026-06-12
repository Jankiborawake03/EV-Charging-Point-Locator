package com.voltway.backend.voltway.repository;

import com.voltway.backend.voltway.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserEmail(String userEmail);
    List<Booking> findByHostEmail(String hostEmail);

}