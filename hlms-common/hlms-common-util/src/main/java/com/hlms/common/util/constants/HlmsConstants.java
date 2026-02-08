package com.hlms.common.util.constants;

import java.math.RoundingMode;

public final class HlmsConstants {

    private HlmsConstants() {}

    public static final int MONETARY_SCALE = 2;
    public static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;
    public static final int INTEREST_RATE_SCALE = 4;

    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;
    public static final String DEFAULT_SORT_FIELD = "createdDate";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    public static final int MAX_LOAN_TENURE_MONTHS = 360;
    public static final int MIN_LOAN_TENURE_MONTHS = 12;
    public static final int DAYS_IN_YEAR = 365;
    public static final int MONTHS_IN_YEAR = 12;

    public static final int SMA0_MIN_DPD = 1;
    public static final int SMA1_MIN_DPD = 31;
    public static final int SMA2_MIN_DPD = 61;
    public static final int NPA_MIN_DPD = 90;
    public static final int DOUBTFUL1_MIN_DPD = 455;
    public static final int DOUBTFUL2_MIN_DPD = 820;
    public static final int DOUBTFUL3_MIN_DPD = 1185;

    public static final double MAX_FOIR_SALARIED = 0.50;
    public static final double MAX_FOIR_SELF_EMPLOYED = 0.60;

    public static final String SYSTEM_USER = "SYSTEM";
    public static final String API_BASE_PATH = "/api/v1";
}
