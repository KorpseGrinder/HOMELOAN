package com.hlms.web.controller;
import com.hlms.common.util.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/api/v1/admin")
public class AdminController {
    @GetMapping("/dashboard") public ResponseEntity<ApiResponse<Map<String, Object>>> dashboard() { return ResponseEntity.ok(ApiResponse.success(Map.of("totalApplications", 150, "totalDisbursed", 85, "totalNpa", 3, "totalPortfolio", 425000000))); }
    @GetMapping("/products") public ResponseEntity<ApiResponse<List<Map<String, Object>>>> products() { return ResponseEntity.ok(ApiResponse.success(List.of(Map.of("productCode", "HL001", "productName", "Home Loan - Salaried")))); }
}
