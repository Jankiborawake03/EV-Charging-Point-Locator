package com.voltway.backend.voltway.repository;

import com.voltway.backend.voltway.model.ChargingStation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ChargingStationRepository extends MongoRepository<ChargingStation, String> {
    List<ChargingStation> findByApprovedTrue();
    List<ChargingStation> findByApproved(boolean isApproved);
    List<ChargingStation> findByEmail(String email);
    List<ChargingStation> findAllByEmail(String email);

}