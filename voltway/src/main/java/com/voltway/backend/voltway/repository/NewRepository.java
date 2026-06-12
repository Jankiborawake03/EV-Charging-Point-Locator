package com.voltway.backend.voltway.repository;

import com.voltway.backend.voltway.model.EVNews;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NewRepository extends MongoRepository<EVNews , String> {
}
