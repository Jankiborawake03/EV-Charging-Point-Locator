package com.voltway.backend.voltway.service;

import com.voltway.backend.voltway.model.Booking;
import com.voltway.backend.voltway.model.ChargingStation;
import com.voltway.backend.voltway.model.User;
import com.voltway.backend.voltway.repository.BookingRepository;
import com.voltway.backend.voltway.repository.ChargingStationRepository;
import com.voltway.backend.voltway.repository.HostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class HostService {

    @Autowired
    private HostRepository hostRepository;

    @Autowired
    private ChargingStationRepository stationRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get Host Details
    public User getHostDetails(String email) {
        return hostRepository.findByEmailAndRole(email, "Station Host")
                .orElseThrow(() -> new RuntimeException("Host not found with email: " + email));
    }

    // Update Host Profile
    public User updateHostProfile(String email, User updatedHost) {
        User existingHost = hostRepository.findByEmailAndRole(email, "Station Host")
                .orElseThrow(() -> new RuntimeException("Host not found with email: " + email));

        // Update allowed fields
        existingHost.setFirstName(updatedHost.getFirstName());
        existingHost.setLastName(updatedHost.getLastName());
        existingHost.setContactNumber(updatedHost.getContactNumber());

        return hostRepository.save(existingHost);
    }

    // Updated to handle base64 strings directly
    public String uploadProfilePhoto(String email, String base64Photo) {
        User host = hostRepository.findByEmailAndRole(email, "Station Host")
                .orElseThrow(() -> new RuntimeException("Host not found with email: " + email));

        host.setProfilePhoto(base64Photo);
        hostRepository.save(host);
        return base64Photo;
    }

    // Original method for backward compatibility
    public String uploadProfilePhoto(String email, MultipartFile file) throws IOException {
        User host = hostRepository.findByEmailAndRole(email, "Station Host")
                .orElseThrow(() -> new RuntimeException("Host not found with email: " + email));

        // Convert MultipartFile to Base64 string
        String base64Photo = Base64.getEncoder().encodeToString(file.getBytes());
        host.setProfilePhoto(base64Photo);

        hostRepository.save(host);
        return base64Photo;
    }




    public List<Booking> getHostBookings(String email) {
        try {
            System.out.println("Looking up bookings for host email: " + email);
            return bookingRepository.findByHostEmail(email);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching bookings: " + e.getMessage());
        }
    }


    public User addStation(String email, User stationDetails) {
        User host = hostRepository.findByEmailAndRole(email, "Station Host")
                .orElseThrow(() -> new RuntimeException("Host not found with email: " + email));

        if (host.getStationName() != null && !host.getStationName().isEmpty()) {
            throw new RuntimeException("Station already registered");
        }

        host.setStationName(stationDetails.getStationName());
        host.setAddress(stationDetails.getAddress());
        host.setPorts(stationDetails.getPorts());
        host.setChargerType(stationDetails.getChargerType());

        return hostRepository.save(host);
    }




    public Booking completeCharging(String bookingId, String hostEmail) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new RuntimeException("Booking not found with ID: " + bookingId);
        }

        Booking booking = bookingOpt.get();


        if (!booking.getHostEmail().equals(hostEmail)) {
            throw new RuntimeException("You don't have permission to update this booking");
        }


        booking.setStatus("COMPLETED");
        booking.setChargingEndTime(java.time.LocalDateTime.now());


        if (booking.getChargingStartTime() != null) {
            long minutes = java.time.Duration.between(booking.getChargingStartTime(), booking.getChargingEndTime()).toMinutes();

            double amount = Math.max(minutes * 0.25, 5.0);
            booking.setAmount(amount);
        } else {

            booking.setAmount(15.0);
        }

        return bookingRepository.save(booking);
    }


    public List<ChargingStation> getHostStations(String email) {
        try {
            System.out.println("Fetching stations for host email: " + email);
            List<ChargingStation> stations = stationRepository.findByEmail(email);
            System.out.println("Found " + (stations != null ? stations.size() : 0) + " stations");
            if (stations == null) {
                return Collections.emptyList();
            }
            return stations;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error fetching stations: " + e.getMessage());
        }
    }


    public ChargingStation toggleStationActivation(String stationId, String hostEmail) {
        Optional<ChargingStation> stationOpt = stationRepository.findById(stationId);
        if (stationOpt.isEmpty()) {
            throw new RuntimeException("Station not found with ID: " + stationId);
        }

        ChargingStation station = stationOpt.get();


        if (!station.getEmail().equals(hostEmail)) {
            throw new RuntimeException("You don't have permission to modify this station");
        }


        station.setActive(!station.isActive());
        System.out.println("Toggling station " + stationId + " activation status to: " + station.isActive());
        return stationRepository.save(station);
    }
}