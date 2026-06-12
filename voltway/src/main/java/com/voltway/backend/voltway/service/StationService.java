package com.voltway.backend.voltway.service;

import com.voltway.backend.voltway.model.ChargingStation;
import com.voltway.backend.voltway.repository.ChargingStationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class StationService {

    @Autowired
    private ChargingStationRepository stationRepository;

    public ChargingStation saveStation(String stationName, String address, String pinCode,
                                       double latitude, double longitude, MultipartFile file,
                                       String email, List<String> vehicleTypes, List<String> chargerTypes) throws IOException {
        String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

        ChargingStation station = new ChargingStation(stationName, address, pinCode, latitude, longitude,
                base64Image, false, vehicleTypes, chargerTypes);
        station.setEmail(email);
        station.setActive(true);
        return stationRepository.save(station);
    }

    public List<ChargingStation> getAllStations() {
        return stationRepository.findAll();
    }

    public Optional<ChargingStation> getStationById(String id) {
        return stationRepository.findById(id);
    }

    public List<ChargingStation> getApprovedStations() {
        return stationRepository.findByApproved(true);
    }

    public List<ChargingStation> getUnapprovedStations() {
        return stationRepository.findByApproved(false);
    }

    public ChargingStation approveStation(String id) {
        Optional<ChargingStation> optionalStation = stationRepository.findById(id);
        if (optionalStation.isPresent()) {
            ChargingStation station = optionalStation.get();
            station.setApproved(true);
            return stationRepository.save(station);
        }
        return null;
    }

    public ChargingStation approveStationByEmail(String email) {
        List<ChargingStation> stations = stationRepository.findByEmail(email);
        if (!stations.isEmpty()) {
            ChargingStation station = stations.get(0);
            station.setApproved(true);
            return stationRepository.save(station);
        }
        return null;
    }

    public boolean rejectStation(String id) {
        if (stationRepository.existsById(id)) {
            stationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean rejectStationByEmail(String email) {
        List<ChargingStation> stations = stationRepository.findByEmail(email);
        if (!stations.isEmpty()) {
            ChargingStation station = stations.get(0);
            stationRepository.delete(station);
            return true;
        }
        return false;
    }

    // New method to toggle station activation status
    public ChargingStation toggleStationActivation(String id) {
        Optional<ChargingStation> optionalStation = stationRepository.findById(id);
        if (optionalStation.isPresent()) {
            ChargingStation station = optionalStation.get();
            station.setActive(!station.isActive());
            return stationRepository.save(station);
        }
        return null;
    }

    // Method to get stations by email
    public List<ChargingStation> getStationsByEmail(String email) {
        return stationRepository.findByEmail(email);
    }
}