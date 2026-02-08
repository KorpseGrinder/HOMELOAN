package com.hlms.web.controller;
import com.hlms.application.disbursement.dto.*;
import com.hlms.application.disbursement.usecase.InitiateDisbursementUseCase;
import com.hlms.common.util.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/loans/{loanId}")
public class DisbursementController {
    private final InitiateDisbursementUseCase disbUseCase;
    public DisbursementController(InitiateDisbursementUseCase disbUseCase) { this.disbUseCase = disbUseCase; }
    @PostMapping("/disburse") public ResponseEntity<ApiResponse<DisbursementResponse>> disburse(@PathVariable Long loanId, @Valid @RequestBody DisbursementRequest req) { return ResponseEntity.ok(ApiResponse.success(disbUseCase.execute(req))); }
}
