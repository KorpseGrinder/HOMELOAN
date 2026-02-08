package com.hlms.web.controller;

import com.hlms.common.util.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/loans/{loanAccountId}")
@RequiredArgsConstructor
@Slf4j
public class LoanServicingController {

    @GetMapping("/account")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getLoanAccount(@PathVariable Long loanAccountId) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "accountId", loanAccountId,
            "loanAccountNumber", "HLMS2024000001",
            "accountStatus", "ACTIVE",
            "disbursedAmount", new BigDecimal("5000000.00"),
            "outstandingPrincipal", new BigDecimal("4850000.00"),
            "interestRate", new BigDecimal("8.50"),
            "emiAmount", new BigDecimal("38946.00"),
            "tenureMonths", 240,
            "dpd", 0
        )));
    }

    @GetMapping("/schedule")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getRepaymentSchedule(@PathVariable Long loanAccountId) {
        List<Map<String, Object>> schedule = List.of(
            Map.of("installmentNumber", 1, "dueDate", "2025-02-05", "emiAmount", 38946, "principal", 3529, "interest", 35417, "openingBalance", 5000000, "closingBalance", 4996471),
            Map.of("installmentNumber", 2, "dueDate", "2025-03-05", "emiAmount", 38946, "principal", 3554, "interest", 35392, "openingBalance", 4996471, "closingBalance", 4992917)
        );
        return ResponseEntity.ok(ApiResponse.success(schedule));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTransactions(
            @PathVariable Long loanAccountId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Map<String, Object>> transactions = List.of(
            Map.of("transactionId", 1L, "transactionType", "DISBURSEMENT", "amount", 5000000, "transactionDate", "2025-01-15", "referenceNumber", "UTR202501150001"),
            Map.of("transactionId", 2L, "transactionType", "EMI_PAYMENT", "amount", 38946, "transactionDate", "2025-02-05", "referenceNumber", "NACH202502050001")
        );
        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @PostMapping("/prepay")
    public ResponseEntity<ApiResponse<Map<String, Object>>> processPrepayment(
            @PathVariable Long loanAccountId, @RequestBody Map<String, Object> request) {
        log.info("Processing prepayment for account: {}", loanAccountId);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "accountId", loanAccountId,
            "prepaymentAmount", request.getOrDefault("amount", 500000),
            "prepaymentCharges", 0,
            "newOutstanding", 4350000,
            "newEmi", 37500,
            "remarks", "Prepayment processed. No charges for floating rate as per RBI guidelines."
        )));
    }

    @PostMapping("/close")
    public ResponseEntity<ApiResponse<Map<String, Object>>> initiateForeclosure(
            @PathVariable Long loanAccountId, @RequestBody Map<String, Object> request) {
        log.info("Initiating foreclosure for account: {}", loanAccountId);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "accountId", loanAccountId,
            "closureType", "FORECLOSURE",
            "principalOutstanding", 4850000,
            "interestOutstanding", 12500,
            "foreclosureCharges", 0,
            "totalSettlementAmount", 4862500,
            "status", "PENDING_APPROVAL"
        )));
    }

    @GetMapping("/statement")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatement(
            @PathVariable Long loanAccountId,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "accountId", loanAccountId,
            "statementPeriod", Map.of("from", "2025-01-01", "to", "2025-12-31"),
            "openingBalance", 5000000,
            "closingBalance", 4850000,
            "totalPrincipalPaid", 150000,
            "totalInterestPaid", 317580,
            "totalTransactions", 12
        )));
    }

    @GetMapping("/tax-certificate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTaxCertificate(
            @PathVariable Long loanAccountId,
            @RequestParam(defaultValue = "2024-2025") String financialYear) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "accountId", loanAccountId,
            "financialYear", financialYear,
            "totalInterestPaid", new BigDecimal("425000.00"),
            "totalPrincipalPaid", new BigDecimal("150000.00"),
            "certificateNumber", "HLMS-TAX-2024-000001",
            "section24Benefit", new BigDecimal("200000.00"),
            "section80CBenefit", new BigDecimal("150000.00")
        )));
    }

    @GetMapping("/noc")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getNoc(@PathVariable Long loanAccountId) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
            "accountId", loanAccountId,
            "nocAvailable", false,
            "message", "NOC is available only after loan closure and all dues are cleared."
        )));
    }
}
