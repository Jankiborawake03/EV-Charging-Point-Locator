package com.voltway.backend.voltway.model;

import lombok.Data;

@Data
public class Review {
    private String station;
    private int rating;
    private String comment;
}