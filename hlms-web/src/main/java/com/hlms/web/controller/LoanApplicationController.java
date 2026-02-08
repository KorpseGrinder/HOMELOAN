package com.hlms.web.controller;
import com.hlms.application.origination.dto.*;
import com.hlms.application.origination.usecase.*;
import com.hlms.common.util.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/v1/applications")
public class LoanApplicationController {
    private final CreateLeadUseCase createLead;
    private final CheckEligibilityUseCase checkEligibility;
    public LoanApplicationController(CreateLeadUseCase createLead, CheckEligibilityUseCase checkEligibility) { this.createLead = createLead; this.checkEligibility = checkEligibility; }
    @PostMapping("/leads") public ResponseEntity<ApiResponse<CreateLeadResponse>> createLead(@Valid @RequestBody CreateLeadRequest req) { return ResponseEntity.ok(ApiResponse.success(createLead.execute(req))); }
    @GetMapping("/{id}/eligibility") public ResponseEntity<ApiResponse<EligibilityResponse>> checkEligibility(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.success(checkEligibility.execute(id))); }
    @GetMapping("/{id}") public ResponseEntity<ApiResponse<Map<String, Object>>> get(@PathVariable Long id) { return ResponseEntity.ok(ApiResponse.success(Map.of("applicationId", id, "status", "SANCTIONED"))); }
}
