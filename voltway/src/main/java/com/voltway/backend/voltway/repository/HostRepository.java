package com.voltway.backend.voltway.repository;

import com.voltway.backend.voltway.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HostRepository extends MongoRepository<User, String> {
    // Find all hosts
    @Query("{'role': 'Station Host'}")
    List<User> findAllHosts();


    Optional<User> findByEmailAndRole(String email, String role);


    @Query("{'role': 'Station Host', 'chargerType': ?0}")
    List<User> findHostsByChargerType(String chargerType);


    @Query(value="{'role': 'Station Host'}", count=true)
    long countHosts();
}