package com.hlms.infrastructure.integration.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile({"dev", "mock"})
public class NotificationMockAdapter {

    private static final Logger log = LoggerFactory.getLogger(NotificationMockAdapter.class);

    public void sendSms(String mobileNumber, String message) {
        log.info("[MOCK] SMS to {}: {}", mobileNumber, message);
    }

    public void sendEmail(String emailId, String subject, String body) {
        log.info("[MOCK] Email to {}: subject={}", emailId, subject);
    }
}
