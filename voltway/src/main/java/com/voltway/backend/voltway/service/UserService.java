package com.voltway.backend.voltway.service;

import com.voltway.backend.voltway.model.User;
import com.voltway.backend.voltway.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserByEmail(String email) {

        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {

        return userRepository.save(user);
    }
}