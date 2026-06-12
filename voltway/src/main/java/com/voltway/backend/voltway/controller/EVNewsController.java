package com.voltway.backend.voltway.controller;


import com.voltway.backend.voltway.model.EVNews;
import com.voltway.backend.voltway.service.EVNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:4200")
public class EVNewsController {

    @Autowired
    private EVNewsService newsService;

    @GetMapping
    public List<EVNews> getAllNews() {
        return newsService.getAllNews();
    }

    @PostMapping
    public EVNews addNews(@RequestBody EVNews news) {
        return newsService.addNews(news);
    }
}
