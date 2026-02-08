package com.hlms.domain.customer.port.outbound;

import com.hlms.common.util.enums.CreditBureau;
import com.hlms.domain.customer.vo.CibilScore;
import com.hlms.domain.customer.vo.CreditReport;

import java.time.LocalDate;

/**
 * Outbound port for credit bureau integrations.
 * Implementation resides in the infrastructure layer.
 */
public interface CreditBureauPort {

    CibilScore fetchCreditScore(String pan, String name, LocalDate dob, CreditBureau bureau);

    CreditReport fetchFullReport(String pan, String consentId, CreditBureau bureau);
}
