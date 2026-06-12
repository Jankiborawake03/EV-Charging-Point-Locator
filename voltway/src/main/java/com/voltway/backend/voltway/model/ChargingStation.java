package com.voltway.backend.voltway.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "charging_stations")
public class ChargingStation {
    @Id
    private String id;
    private String stationName;
    private String email; // Owner's email address
    private String address;
    private String pinCode;
    private int ports;
    private List<String> chargerTypes;
    private List<String> vehicleTypes;
    private String imageData;
    private boolean active;
    private boolean approved;
    private double latitude;
    private double longitude;

    // Default constructor
    public ChargingStation() {
    }

    // Constructor matching the one used in StationService
    public ChargingStation(String stationName, String address, String pinCode, double latitude, double longitude,
                           String imageData, boolean approved, List<String> vehicleTypes, List<String> chargerTypes) {
        this.stationName = stationName;
        this.address = address;
        this.pinCode = pinCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageData = imageData;
        this.approved = approved;
        this.vehicleTypes = vehicleTypes;
        this.chargerTypes = chargerTypes;
        this.active = true;
    }

    // Original constructor - keeping it for backward compatibility
    public ChargingStation(String id, String stationName, String email, String address, int ports,
                           String chargerType, boolean active, boolean approved, double latitude, double longitude) {
        this.id = id;
        this.stationName = stationName;
        this.email = email;
        this.address = address;
        this.ports = ports;
        this.chargerTypes = List.of(chargerType); // Convert String to List with single item
        this.active = active;
        this.approved = approved;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }

    public int getPorts() {
        return ports;
    }

    public void setPorts(int ports) {
        this.ports = ports;
    }

    public List<String> getChargerTypes() {
        return chargerTypes;
    }

    public void setChargerTypes(List<String> chargerTypes) {
        this.chargerTypes = chargerTypes;
    }

    public List<String> getVehicleTypes() {
        return vehicleTypes;
    }

    public void setVehicleTypes(List<String> vehicleTypes) {
        this.vehicleTypes = vehicleTypes;
    }

    public String getImageData() {
        return imageData;
    }

    public void setImageData(String imageData) {
        this.imageData = imageData;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}