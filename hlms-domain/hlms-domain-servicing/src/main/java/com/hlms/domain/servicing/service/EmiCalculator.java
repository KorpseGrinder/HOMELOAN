package com.hlms.domain.servicing.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

public class EmiCalculator {

    /**
     * Calculate EMI using the standard formula:
     * EMI = P x R x (1+R)^N / ((1+R)^N - 1)
     *
     * Where:
     *   P = Principal loan amount
     *   R = Monthly interest rate (annual rate / 12 / 100)
     *   N = Number of monthly installments (tenure in months)
     *
     * @param principal   the loan principal amount
     * @param annualRate  the annual interest rate (e.g., 8.5 for 8.5% p.a.)
     * @param tenureMonths number of monthly installments
     * @return calculated EMI amount rounded to 2 decimal places
     */
    public BigDecimal calculateEmi(BigDecimal principal, BigDecimal annualRate, int tenureMonths) {
        if (principal.compareTo(BigDecimal.ZERO) <= 0 || tenureMonths <= 0) {
            return BigDecimal.ZERO;
        }
        if (annualRate.compareTo(BigDecimal.ZERO) == 0) {
            return principal.divide(BigDecimal.valueOf(tenureMonths), 2, RoundingMode.HALF_UP);
        }

        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal onePlusRPowerN = onePlusR.pow(tenureMonths, MathContext.DECIMAL128);
        BigDecimal numerator = principal.multiply(monthlyRate).multiply(onePlusRPowerN);
        BigDecimal denominator = onePlusRPowerN.subtract(BigDecimal.ONE);

        return numerator.divide(denominator, 2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate tenure (number of months) given principal, EMI, and annual rate.
     * Uses the formula: N = -log(1 - P*R/EMI) / log(1+R)
     *
     * @param principal  the remaining principal amount
     * @param emi        the fixed EMI amount
     * @param annualRate the annual interest rate (e.g., 8.5 for 8.5%)
     * @return calculated tenure in months (rounded up)
     */
    public int calculateTenure(BigDecimal principal, BigDecimal emi, BigDecimal annualRate) {
        if (emi.compareTo(BigDecimal.ZERO) <= 0 || principal.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }
        double monthlyRate = annualRate.doubleValue() / 1200.0;
        double p = principal.doubleValue();
        double e = emi.doubleValue();

        if (monthlyRate == 0) {
            return (int) Math.ceil(p / e);
        }

        double numerator = Math.log(e / (e - p * monthlyRate));
        double denominator = Math.log(1 + monthlyRate);

        return (int) Math.ceil(numerator / denominator);
    }
}