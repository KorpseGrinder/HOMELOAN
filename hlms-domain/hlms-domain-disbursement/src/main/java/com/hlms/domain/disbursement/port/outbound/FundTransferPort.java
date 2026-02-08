package com.hlms.domain.disbursement.port.outbound;
import com.hlms.domain.disbursement.vo.FundTransferRequest;
import com.hlms.domain.disbursement.vo.FundTransferResult;
public interface FundTransferPort { FundTransferResult transfer(FundTransferRequest request); }
