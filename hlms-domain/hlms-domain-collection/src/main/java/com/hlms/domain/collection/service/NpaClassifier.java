package com.hlms.domain.collection.service;

import com.hlms.common.util.constants.HlmsConstants;
import com.hlms.common.util.enums.CollectionBucket;
import com.hlms.common.util.enums.NpaCategory;

public class NpaClassifier {

    public CollectionBucket classifyBucket(int dpd) {
        if (dpd == 0) return CollectionBucket.CURRENT;
        if (dpd <= 30) return CollectionBucket.SMA_0;
        if (dpd <= 60) return CollectionBucket.SMA_1;
        if (dpd <= 90) return CollectionBucket.SMA_2;
        if (dpd <= HlmsConstants.DOUBTFUL1_MIN_DPD) return CollectionBucket.NPA_SUBSTANDARD;
        if (dpd <= HlmsConstants.DOUBTFUL2_MIN_DPD) return CollectionBucket.NPA_DOUBTFUL_D1;
        if (dpd <= HlmsConstants.DOUBTFUL3_MIN_DPD) return CollectionBucket.NPA_DOUBTFUL_D2;
        if (dpd <= 1460) return CollectionBucket.NPA_DOUBTFUL_D3;
        return CollectionBucket.NPA_LOSS;
    }

    public NpaCategory classifyNpa(int dpd) {
        if (dpd < HlmsConstants.NPA_MIN_DPD) return null;
        if (dpd <= HlmsConstants.DOUBTFUL1_MIN_DPD) return NpaCategory.SUBSTANDARD;
        if (dpd <= HlmsConstants.DOUBTFUL2_MIN_DPD) return NpaCategory.DOUBTFUL_1;
        if (dpd <= HlmsConstants.DOUBTFUL3_MIN_DPD) return NpaCategory.DOUBTFUL_2;
        return NpaCategory.LOSS;
    }

    public boolean isNpa(int dpd) {
        return dpd >= HlmsConstants.NPA_MIN_DPD;
    }
}
