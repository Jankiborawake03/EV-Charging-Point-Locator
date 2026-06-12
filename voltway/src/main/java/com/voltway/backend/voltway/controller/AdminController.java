package com.voltway.backend.voltway.controller;

import com.voltway.backend.voltway.model.ChargingStation;
import com.voltway.backend.voltway.model.EVNews;
import com.voltway.backend.voltway.repository.NewRepository;
import com.voltway.backend.voltway.service.StationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/admin")
public class AdminController {
    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private StationService stationService;

    @Autowired
    private NewRepository newRepository;

    @GetMapping("/pending-stations")
    public ResponseEntity<List<ChargingStation>> getPendingStations() {
        List<ChargingStation> pendingStations = stationService.getUnapprovedStations();
        logger.info("Retrieved {} pending stations", pendingStations.size());
        return ResponseEntity.ok(pendingStations);
    }

    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveStation(@PathVariable String id) {
        try {
            ChargingStation station = stationService.approveStation(id);
            if (station != null) {
                logger.info("Station {} approved successfully", id);
                return ResponseEntity.ok(station);
            } else {
                logger.warn("Station {} not found for approval", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error approving station", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to approve station"));
        }
    }

    @PutMapping("/approve-by-email/{email}")
    public ResponseEntity<?> approveStationByEmail(@PathVariable String email) {
        ChargingStation station = stationService.approveStationByEmail(email);
        if (station != null) {
            return ResponseEntity.ok(station);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Station not found with email: " + email);
        }
    }


    @DeleteMapping("/reject/{id}")
    public ResponseEntity<?> rejectStation(@PathVariable String id) {
        try {
            boolean deleted = stationService.rejectStation(id);
            if (deleted) {
                logger.info("Station {} rejected successfully", id);
                return ResponseEntity.ok(Collections.singletonMap("message", "Station rejected successfully"));
            } else {
                logger.warn("Station {} not found for rejection", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error rejecting station", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to reject station"));
        }
    }

    @DeleteMapping("/reject-by-email/{email}")
    public ResponseEntity<?> rejectStationByEmail(@PathVariable String email) {
        boolean deleted = stationService.rejectStationByEmail(email);
        if (deleted) {
            return ResponseEntity.ok("Station rejected and deleted for email: " + email);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Station not found with email: " + email);
        }
    }


    @GetMapping("/news")
    public ResponseEntity<List<EVNews>> getAllNews() {
        List<EVNews> newsList = newRepository.findAll();
        logger.info("Retrieved {} news items", newsList.size());
        return ResponseEntity.ok(newsList);
    }

    @PostMapping("/news")
    public ResponseEntity<?> addNews(@RequestBody EVNews news) {
        try {
            if (news.getTitle() == null || news.getContent() == null) {
                return ResponseEntity.badRequest()
                        .body(Collections.singletonMap("error", "Title and content are required"));
            }

            EVNews savedNews = newRepository.save(news);
            logger.info("News added: {}", savedNews.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedNews);
        } catch (Exception e) {
            logger.error("Error adding news", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to save news"));
        }
    }

    @DeleteMapping("/news/{id}")
    public ResponseEntity<?> deleteNews(@PathVariable String id) {
        try {
            if (newRepository.existsById(id)) {
                newRepository.deleteById(id);
                logger.info("News item {} deleted successfully", id);
                return ResponseEntity.noContent().build();
            } else {
                logger.warn("News item {} not found for deletion", id);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error deleting news", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Failed to delete news"));
        }
    }
}