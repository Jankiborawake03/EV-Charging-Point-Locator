package com.voltway.backend.voltway.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Transaction {
    private double amount;
    private LocalDateTime date;
    private String status;
}
