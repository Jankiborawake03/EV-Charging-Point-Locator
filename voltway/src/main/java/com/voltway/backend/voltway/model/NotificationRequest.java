package com.voltway.backend.voltway.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class NotificationRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String message;
    private String requestType;
    private String requestDate;
    private String status; // PENDING, APPROVED, REJECTED
    private Date respondedAt;
    private String responseMessage;
    private String actionBy;
    private  String userName;


    // Default constructor for Jackson
    public NotificationRequest() {}



    public NotificationRequest(String firstName, String lastName, String email,
                               String message, String requestType, String requestDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.message = message;
        this.requestType = requestType;
        this.requestDate = requestDate;
    }

    // Getters and Setters
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public String getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(String requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDateTime getRequestDateAsLocalDateTime() {
        if (requestDate == null || requestDate.isEmpty()) {
            return LocalDateTime.now();
        }
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            return LocalDateTime.parse(requestDate, formatter);
        } catch (Exception e) {
            return LocalDateTime.now();
        }
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(Date respondedAt) {
        this.respondedAt = respondedAt;
    }

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }

    public String getActionBy() {
        return actionBy;
    }

    public void setActionBy(String actionBy) {
        this.actionBy = actionBy;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
    public String getUserName() {
        return userName;
    }
}