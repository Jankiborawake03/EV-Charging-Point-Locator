package com.voltway.backend.voltway.controller;

import com.voltway.backend.voltway.model.ChargingStation;
import com.voltway.backend.voltway.service.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/stations")
public class StationController {

    @Autowired
    private StationService stationService;

    @PostMapping("/register")
    public ResponseEntity<?> registerStation(
            @RequestParam("stationName") String stationName,
            @RequestParam("address") String address,
            @RequestParam("pinCode") String pinCode,
            @RequestParam("latitude") String latitude,
            @RequestParam("longitude") String longitude,
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("email") String email,
            @RequestParam("vehicleTypes") String vehicleTypes,
            @RequestParam("chargerTypes") String chargerTypes) {
        try {
            double lat = Double.parseDouble(latitude);
            double lng = Double.parseDouble(longitude);


            List<String> vehicleTypesList = Arrays.stream(vehicleTypes.split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());

            List<String> chargerTypesList = Arrays.stream(chargerTypes.split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());

            ChargingStation savedStation = stationService.saveStation(
                    stationName, address, pinCode, lat, lng, photo, email,
                    vehicleTypesList, chargerTypesList);

            return ResponseEntity.ok(savedStation);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving image");
        } catch (NumberFormatException e) {
            return ResponseEntity.status(400).body("Invalid latitude/longitude format");
        }
    }

    @GetMapping
    public ResponseEntity<List<ChargingStation>> getAllStations() {
        return ResponseEntity.ok(stationService.getAllStations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStationById(@PathVariable String id) {
        Optional<ChargingStation> station = stationService.getStationById(id);
        return station.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveStation(@PathVariable String id) {
        ChargingStation station = stationService.approveStation(id);
        return (station != null) ? ResponseEntity.ok(station) : ResponseEntity.notFound().build();
    }
}