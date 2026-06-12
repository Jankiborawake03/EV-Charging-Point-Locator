package com.voltway.backend.voltway.service;

import com.voltway.backend.voltway.model.EVNews;
import com.voltway.backend.voltway.repository.EVNewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EVNewsService {
    @Autowired
    private EVNewsRepository repository;

    public List<EVNews> getAllNews() {
        return repository.findAllByOrderByDatePublishedDesc();
    }

    public EVNews addNews(EVNews news) {
        return repository.save(news);
    }
}
