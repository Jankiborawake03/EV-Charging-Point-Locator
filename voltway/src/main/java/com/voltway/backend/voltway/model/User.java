package com.voltway.backend.voltway.model;

import jakarta.persistence.Lob;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "Users")
@Data
public class User {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String contactNumber;
    private String email;
    private String password;
    private String role;  // "EV Owner" or "Station Host"
    private String otp;
    private LocalDateTime otpExpiry;



    // Station host fields
    private String stationName;
    private String address;
    private int ports;
    private String chargerType;



    private List<Booking> bookings;  // Booking history
    private List<Transaction> payments;  // Payment history
    private List<Review> reviews;




    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public List<Transaction> getPayments() {
        return payments;
    }

    public void setPayments(List<Transaction> payments) {
        this.payments = payments;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public String getOtp() {
        return otp;
    }


@Lob
    private String profilePhoto;
    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStationName() {
        return stationName;
    }

    public void setStationName(String stationName) {
        this.stationName = stationName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getPorts() {
        return ports;
    }

    public void setPorts(int ports) {
        this.ports = ports;
    }

    public String getChargerType() {
        return chargerType;
    }

    public void setChargerType(String chargerType) {
        this.chargerType = chargerType;
    }
}
