package com.hlms.web.controller;

import com.hlms.common.util.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/collections")
@RequiredArgsConstructor
@Slf4j
public class CollectionController {

    @GetMapping("/cases")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> listCases(
            @RequestParam(required = false) String bucket,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Map<String, Object>> cases = List.of(
            Map.of("caseId", 1L, "accountNumber", "HLMS2024000005", "dpd", 95, "bucket", "NPA_SUBSTANDARD", "overdueAmount", 120000, "status", "OPEN"),
            Map.of("caseId", 2L, "accountNumber", "HLMS2024000010", "dpd", 45, "bucket", "SMA_1", "overdueAmount", 42000, "status", "OPEN")
        );
        return ResponseEntity.ok(ApiResponse.success(cases));
    }

    @GetMapping("/cases/{caseId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCase(@PathVariable Long caseId) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "caseId", caseId,
            "accountNumber", "HLMS2024000005",
            "customerName", "Suresh Patel",
            "dpd", 95,
            "bucket", "NPA_SUBSTANDARD",
            "overdueAmount", 120000,
            "totalOutstanding", 4500000,
            "lastPaymentDate", "2024-10-05",
            "status", "OPEN",
            "assignedTo", "collection_agent_1"
        )));
    }

    @PostMapping("/cases/{caseId}/actions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> logAction(
            @PathVariable Long caseId, @RequestBody Map<String, Object> request) {
        log.info("Logging collection action for case: {}", caseId);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "actionId", 1L,
            "caseId", caseId,
            "actionType", request.getOrDefault("actionType", "PHONE_CALL"),
            "outcome", request.getOrDefault("outcome", "CONTACTED"),
            "status", "RECORDED"
        )));
    }

    @PostMapping("/loans/{loanAccountId}/restructure")
    public ResponseEntity<ApiResponse<Map<String, Object>>> proposeRestructuring(
            @PathVariable Long loanAccountId, @RequestBody Map<String, Object> request) {
        log.info("Proposing restructuring for loan: {}", loanAccountId);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "restructuringId", 1L,
            "accountId", loanAccountId,
            "restructuringType", request.getOrDefault("type", "TENURE_EXTENSION"),
            "oldEmi", 38946,
            "newEmi", 32500,
            "oldTenure", 240,
            "newTenure", 300,
            "status", "PENDING_APPROVAL"
        )));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCollectionDashboard() {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "totalCases", 150,
            "bucketWise", Map.of(
                "CURRENT", 5000, "SMA_0", 120, "SMA_1", 45,
                "SMA_2", 20, "NPA_SUBSTANDARD", 30, "NPA_DOUBTFUL_1", 10
            ),
            "totalOverdueAmount", 45000000,
            "totalNpaAmount", 25000000,
            "resolutionRate", 65.5
        )));
    }
}
