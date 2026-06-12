package com.voltway.backend.voltway.repository;


import com.voltway.backend.voltway.model.EVNews;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EVNewsRepository extends MongoRepository<EVNews, String> {
    List<EVNews> findAllByOrderByDatePublishedDesc();
}
