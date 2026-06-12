package com.voltway.backend.voltway.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "ev_news")
public class EVNews {
    @Id
    private String id;
    private String title;
    private String content;
    private String imageUrl;
    private LocalDateTime datePublished;


    public EVNews(String id, String title, String content, String imageUrl, LocalDateTime datePublished) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.datePublished = datePublished;
    }

    public EVNews() {
        this.datePublished = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getDatePublished() {
        return datePublished;
    }

    public void setDatePublished(LocalDateTime datePublished) {
        this.datePublished = datePublished;
    }
}