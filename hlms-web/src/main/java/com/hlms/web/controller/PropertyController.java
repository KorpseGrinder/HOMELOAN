package com.hlms.web.controller;

import com.hlms.common.util.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/applications/{applicationId}/property")
@RequiredArgsConstructor
@Slf4j
public class PropertyController {

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> addProperty(
            @PathVariable Long applicationId, @RequestBody Map<String, Object> request) {
        log.info("Adding property for application: {}", applicationId);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "propertyId", 1L,
            "applicationId", applicationId,
            "propertyType", request.getOrDefault("propertyType", "FLAT"),
            "status", "CREATED"
        )));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProperty(@PathVariable Long applicationId) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "propertyId", 1L,
            "applicationId", applicationId,
            "propertyType", "FLAT",
            "constructionStatus", "READY_TO_MOVE",
            "city", "Mumbai",
            "state", "Maharashtra",
            "estimatedValue", 7500000
        )));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateProperty(
            @PathVariable Long applicationId, @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "applicationId", applicationId,
            "status", "UPDATED"
        )));
    }

    @PostMapping("/valuation")
    public ResponseEntity<ApiResponse<Map<String, Object>>> initiateValuation(@PathVariable Long applicationId) {
        log.info("Initiating property valuation for application: {}", applicationId);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "applicationId", applicationId,
            "valuationId", 1L,
            "valuationType", "INTERNAL",
            "valuationStatus", "INITIATED",
            "assignedValuator", "ABC Valuators Pvt Ltd"
        )));
    }

    @GetMapping("/valuation")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getValuation(@PathVariable Long applicationId) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "applicationId", applicationId,
            "valuationId", 1L,
            "fairMarketValue", 7500000,
            "forcedSaleValue", 6000000,
            "valuationStatus", "COMPLETED"
        )));
    }

    @GetMapping("/legal-opinion")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLegalOpinion(@PathVariable Long applicationId) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "applicationId", applicationId,
            "titleStatus", "CLEAR",
            "encumbranceCheck", true,
            "litigationPending", false,
            "recommendation", "Title is clear. Property can be accepted as collateral."
        )));
    }
}
