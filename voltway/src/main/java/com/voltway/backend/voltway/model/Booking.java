package com.voltway.backend.voltway.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;


    private String userEmail;
    private String hostEmail;
    private String stationId;
    private String stationName;
    private LocalDateTime bookingTime;
    private LocalDateTime chargingStartTime;
    private LocalDateTime chargingEndTime;
    private double amount;
    private String status;
    private String paymentStatus;
    private String paymentTransactionId;

    public Booking() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getHostEmail() {
        return hostEmail;
    }

    public void setHostEmail(String hostEmail) {
        this.hostEmail = hostEmail;
    }

    public String getStationId() {
        return stationId;
    }

    public void setStationId(String stationId) {
        this.stationId = stationId;
    }

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public LocalDateTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalDateTime bookingTime) {
        this.bookingTime = bookingTime;
    }

    public LocalDateTime getChargingStartTime() {
        return chargingStartTime;
    }

    public void setChargingStartTime(LocalDateTime chargingStartTime) {
        this.chargingStartTime = chargingStartTime;
    }

    public LocalDateTime getChargingEndTime() {
        return chargingEndTime;
    }

    public void setChargingEndTime(LocalDateTime chargingEndTime) {
        this.chargingEndTime = chargingEndTime;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentTransactionId() {
        return paymentTransactionId;
    }

    public void setPaymentTransactionId(String paymentTransactionId) {
        this.paymentTransactionId = paymentTransactionId;
    }
}