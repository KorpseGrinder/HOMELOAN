package com.hlms.domain.disbursement.port.outbound;
public interface CersaiPort { String registerCharge(Long applicationId, Long propertyId); boolean modifyCharge(String registrationId); boolean satisfyCharge(String registrationId); }
