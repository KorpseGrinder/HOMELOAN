package com.hlms.domain.disbursement.port.outbound;
public interface EsignPort { String initiateEsign(Long applicationId, byte[] document); boolean verifyEsign(String esignReference); }
