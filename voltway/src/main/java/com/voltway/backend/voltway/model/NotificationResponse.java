package com.voltway.backend.voltway.model;

public class NotificationResponse {

    private String status; // "APPROVED" or "REJECTED"
    private String responseMessage;
    private String actionBy;

    // Constructors
    public NotificationResponse() {}

    public NotificationResponse(String status, String responseMessage,String actionBy) {
        this.status = status;
        this.responseMessage = responseMessage;
        this.actionBy = actionBy;
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}
