package com.hlms.web.controller;

import com.hlms.common.util.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/customers")
@RequiredArgsConstructor
@Slf4j
public class CustomerController {

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> createCustomer(@RequestBody Map<String, Object> request) {
        log.info("Creating customer: {}", request.getOrDefault("firstName", ""));
        Map<String, Object> response = Map.of(
            "customerId", 1L,
            "firstName", request.getOrDefault("firstName", "John"),
            "lastName", request.getOrDefault("lastName", "Doe"),
            "status", "ACTIVE"
        );
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCustomer(@PathVariable Long id) {
        Map<String, Object> customer = Map.of(
            "customerId", id,
            "firstName", "John",
            "lastName", "Doe",
            "mobileNumber", "9876543210",
            "customerType", "INDIVIDUAL",
            "kycStatus", "VERIFIED"
        );
        return ResponseEntity.ok(ApiResponse.success(customer));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Map<String, Object>> customers = List.of(
            Map.of("customerId", 1L, "firstName", "John", "lastName", "Doe", "mobileNumber", "9876543210"),
            Map.of("customerId", 2L, "firstName", "Jane", "lastName", "Smith", "mobileNumber", "9876543211")
        );
        return ResponseEntity.ok(ApiResponse.success(customers));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateCustomer(
            @PathVariable Long id, @RequestBody Map<String, Object> request) {
        log.info("Updating customer: {}", id);
        request.put("customerId", id);
        return ResponseEntity.ok(ApiResponse.success(Map.of("customerId", id, "status", "UPDATED")));
    }

    @PostMapping("/{id}/kyc/verify")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verifyKyc(@PathVariable Long id) {
        log.info("Verifying KYC for customer: {}", id);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "customerId", id,
            "kycStatus", "VERIFIED",
            "verifiedDate", java.time.LocalDateTime.now().toString()
        )));
    }

    @GetMapping("/{id}/eligibility")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkEligibility(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "customerId", id,
            "eligible", true,
            "maxEligibleAmount", 5000000,
            "foirPercentage", 42.5,
            "remarks", "Customer meets all eligibility criteria"
        )));
    }
}
