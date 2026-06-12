package com.voltway.backend.voltway.repository;

import com.voltway.backend.voltway.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction,String> {
//    List<Transaction> findByHostId(String hostId);

}
