package com.hlms.domain.collection.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class DpdCalculator {
    public int calculateDpd(LocalDate dueDate, LocalDate currentDate) { if (currentDate.isBefore(dueDate) || currentDate.isEqual(dueDate)) return 0; return (int) ChronoUnit.DAYS.between(dueDate, currentDate); }
}
